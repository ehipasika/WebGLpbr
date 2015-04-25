var container, stats;

var camera, scene, renderer;

var objects, controller;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var time;

var propertyGUI;

var material;

var light;
var cubeMapTex;
var boxGeo;


var BRDFFragmentShader = {};

var currentFragShader;

var startTime = new Date();

var stats = new Stats();
stats.setMode( 0 );
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

var currentTime = new Date();
var allPbShaders = [];

init();
animate();

var pbShader;

function loader() {

  pbShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_lightColor: { type: "v3", value: new THREE.Vector3(light.color.r, light.color.g, light.color.b)  },
      u_lightDir: { type: "v3", value: camera.lightDir },
      u_lightPos: { type: "v3", value: light.position},
      u_diffuseColor: {type: "v3", value: new THREE.Vector3(0.9, 0.9, 0.9)},
      u_ambientColor: {type: "v3", value: new THREE.Vector3(0.1, 0.1, 0.1)},
      u_roughness: {type: "f", value: propertyGUI.roughness },
      u_fresnel: {type: "f", value: propertyGUI.fresnel },
      u_alpha: {type: "f", value: propertyGUI.roughness * propertyGUI.roughness },
      u_tCube: {type: "t", value: cubeMapTex },
      u_VDC: {type:"fv1", value: [0.0]}
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: currentFragShader,
  } );


  var VDC = [0, 0.5, 0.25, 0.75, 0.125, 0.625, 0.375, 0.875, 0.0625, 0.5625, 0.3125, 0.8125, 0.1875, 0.6875, 0.4375, 0.9375, 0.03125, 0.53125, 0.28125, 0.78125, 0.15625, 0.65625, 0.40625, 0.90625, 0.09375, 0.59375, 0.34375, 0.84375, 0.21875, 0.71875, 0.46875, 0.96875, 0.015625, 0.515625, 0.265625, 0.765625, 0.140625, 0.640625, 0.390625, 0.890625, 0.078125, 0.578125, 0.328125, 0.828125, 0.203125, 0.703125, 0.453125, 0.953125, 0.046875, 0.546875, 0.296875, 0.796875, 0.171875, 0.671875, 0.421875, 0.921875, 0.109375, 0.609375, 0.359375, 0.859375, 0.234375, 0.734375, 0.484375, 0.984375, 0.0078125, 0.5078125, 0.2578125, 0.7578125, 0.1328125, 0.6328125, 0.3828125, 0.8828125, 0.0703125, 0.5703125, 0.3203125, 0.8203125, 0.1953125, 0.6953125, 0.4453125, 0.9453125, 0.0390625, 0.5390625, 0.2890625, 0.7890625, 0.1640625, 0.6640625, 0.4140625, 0.9140625, 0.1015625, 0.6015625, 0.3515625, 0.8515625, 0.2265625, 0.7265625, 0.4765625, 0.9765625, 0.0234375, 0.5234375, 0.2734375, 0.7734375, 0.1484375, 0.6484375, 0.3984375, 0.8984375, 0.0859375, 0.5859375, 0.3359375, 0.8359375, 0.2109375, 0.7109375, 0.4609375, 0.9609375, 0.0546875, 0.5546875, 0.3046875, 0.8046875, 0.1796875, 0.6796875, 0.4296875, 0.9296875, 0.1171875, 0.6171875, 0.3671875, 0.8671875, 0.2421875, 0.7421875, 0.4921875, 0.9921875, 0.00390625, 0.50390625, 0.25390625, 0.75390625, 0.12890625, 0.62890625, 0.37890625, 0.87890625, 0.06640625, 0.56640625, 0.31640625, 0.81640625, 0.19140625, 0.69140625, 0.44140625, 0.94140625, 0.03515625, 0.53515625, 0.28515625, 0.78515625, 0.16015625, 0.66015625, 0.41015625, 0.91015625, 0.09765625, 0.59765625, 0.34765625, 0.84765625, 0.22265625, 0.72265625, 0.47265625, 0.97265625, 0.01953125, 0.51953125, 0.26953125, 0.76953125, 0.14453125, 0.64453125, 0.39453125, 0.89453125, 0.08203125, 0.58203125, 0.33203125, 0.83203125, 0.20703125, 0.70703125, 0.45703125, 0.95703125, 0.05078125, 0.55078125, 0.30078125, 0.80078125, 0.17578125, 0.67578125, 0.42578125, 0.92578125, 0.11328125, 0.61328125, 0.36328125, 0.86328125, 0.23828125, 0.73828125, 0.48828125, 0.98828125, 0.01171875, 0.51171875, 0.26171875, 0.76171875, 0.13671875, 0.63671875, 0.38671875, 0.88671875, 0.07421875, 0.57421875, 0.32421875, 0.82421875, 0.19921875, 0.69921875, 0.44921875, 0.94921875, 0.04296875, 0.54296875, 0.29296875, 0.79296875, 0.16796875, 0.66796875, 0.41796875, 0.91796875, 0.10546875, 0.60546875, 0.35546875, 0.85546875, 0.23046875, 0.73046875, 0.48046875, 0.98046875, 0.02734375, 0.52734375, 0.27734375, 0.77734375, 0.15234375, 0.65234375, 0.40234375, 0.90234375, 0.08984375, 0.58984375, 0.33984375, 0.83984375, 0.21484375, 0.71484375, 0.46484375, 0.96484375, 0.05859375, 0.55859375, 0.30859375, 0.80859375, 0.18359375, 0.68359375, 0.43359375, 0.93359375, 0.12109375, 0.62109375, 0.37109375, 0.87109375, 0.24609375, 0.74609375, 0.49609375, 0.99609375, 0.001953125, 0.501953125, 0.251953125, 0.751953125, 0.126953125, 0.626953125, 0.376953125, 0.876953125, 0.064453125, 0.564453125, 0.314453125, 0.814453125, 0.189453125, 0.689453125, 0.439453125, 0.939453125, 0.033203125, 0.533203125, 0.283203125, 0.783203125, 0.158203125, 0.658203125, 0.408203125, 0.908203125, 0.095703125, 0.595703125, 0.345703125, 0.845703125, 0.220703125, 0.720703125, 0.470703125, 0.970703125, 0.017578125, 0.517578125, 0.267578125, 0.767578125, 0.142578125, 0.642578125, 0.392578125, 0.892578125, 0.080078125, 0.580078125, 0.330078125, 0.830078125, 0.205078125, 0.705078125, 0.455078125, 0.955078125, 0.048828125, 0.548828125, 0.298828125, 0.798828125, 0.173828125, 0.673828125, 0.423828125, 0.923828125, 0.111328125, 0.611328125, 0.361328125, 0.861328125, 0.236328125, 0.736328125, 0.486328125, 0.986328125, 0.009765625, 0.509765625, 0.259765625, 0.759765625, 0.134765625, 0.634765625, 0.384765625, 0.884765625, 0.072265625, 0.572265625, 0.322265625, 0.822265625, 0.197265625, 0.697265625, 0.447265625, 0.947265625, 0.041015625, 0.541015625, 0.291015625, 0.791015625, 0.166015625, 0.666015625, 0.416015625, 0.916015625, 0.103515625, 0.603515625, 0.353515625, 0.853515625, 0.228515625, 0.728515625, 0.478515625, 0.978515625, 0.025390625, 0.525390625, 0.275390625, 0.775390625, 0.150390625, 0.650390625, 0.400390625, 0.900390625, 0.087890625, 0.587890625, 0.337890625, 0.837890625, 0.212890625, 0.712890625, 0.462890625, 0.962890625, 0.056640625, 0.556640625, 0.306640625, 0.806640625, 0.181640625, 0.681640625, 0.431640625, 0.931640625, 0.119140625, 0.619140625, 0.369140625, 0.869140625, 0.244140625, 0.744140625, 0.494140625, 0.994140625, 0.005859375, 0.505859375, 0.255859375, 0.755859375, 0.130859375, 0.630859375, 0.380859375, 0.880859375, 0.068359375, 0.568359375, 0.318359375, 0.818359375, 0.193359375, 0.693359375, 0.443359375, 0.943359375, 0.037109375, 0.537109375, 0.287109375, 0.787109375, 0.162109375, 0.662109375, 0.412109375, 0.912109375, 0.099609375, 0.599609375, 0.349609375, 0.849609375, 0.224609375, 0.724609375, 0.474609375, 0.974609375, 0.021484375, 0.521484375, 0.271484375, 0.771484375, 0.146484375, 0.646484375, 0.396484375, 0.896484375, 0.083984375, 0.583984375, 0.333984375, 0.833984375, 0.208984375, 0.708984375, 0.458984375, 0.958984375, 0.052734375, 0.552734375, 0.302734375, 0.802734375, 0.177734375, 0.677734375, 0.427734375, 0.927734375, 0.115234375, 0.615234375, 0.365234375, 0.865234375, 0.240234375, 0.740234375, 0.490234375, 0.990234375, 0.013671875, 0.513671875, 0.263671875, 0.763671875, 0.138671875, 0.638671875, 0.388671875, 0.888671875, 0.076171875, 0.576171875, 0.326171875, 0.826171875, 0.201171875, 0.701171875, 0.451171875, 0.951171875, 0.044921875, 0.544921875, 0.294921875, 0.794921875, 0.169921875, 0.669921875, 0.419921875, 0.919921875, 0.107421875, 0.607421875, 0.357421875, 0.857421875, 0.232421875, 0.732421875, 0.482421875, 0.982421875, 0.029296875, 0.529296875, 0.279296875, 0.779296875, 0.154296875, 0.654296875, 0.404296875, 0.904296875, 0.091796875, 0.591796875, 0.341796875, 0.841796875, 0.216796875, 0.716796875, 0.466796875, 0.966796875, 0.060546875, 0.560546875, 0.310546875, 0.810546875, 0.185546875, 0.685546875, 0.435546875, 0.935546875, 0.123046875, 0.623046875, 0.373046875, 0.873046875, 0.248046875, 0.748046875, 0.498046875, 0.998046875, 0.0009765625, 0.5009765625, 0.2509765625, 0.7509765625, 0.1259765625, 0.6259765625, 0.3759765625, 0.8759765625, 0.0634765625, 0.5634765625, 0.3134765625, 0.8134765625, 0.1884765625, 0.6884765625, 0.4384765625, 0.9384765625, 0.0322265625, 0.5322265625, 0.2822265625, 0.7822265625, 0.1572265625, 0.6572265625, 0.4072265625, 0.9072265625, 0.0947265625, 0.5947265625, 0.3447265625, 0.8447265625, 0.2197265625, 0.7197265625, 0.4697265625, 0.9697265625, 0.0166015625, 0.5166015625, 0.2666015625, 0.7666015625, 0.1416015625, 0.6416015625, 0.3916015625, 0.8916015625, 0.0791015625, 0.5791015625, 0.3291015625, 0.8291015625, 0.2041015625, 0.7041015625, 0.4541015625, 0.9541015625, 0.0478515625, 0.5478515625, 0.2978515625, 0.7978515625, 0.1728515625, 0.6728515625, 0.4228515625, 0.9228515625, 0.1103515625, 0.6103515625, 0.3603515625, 0.8603515625, 0.2353515625, 0.7353515625, 0.4853515625, 0.9853515625, 0.0087890625, 0.5087890625, 0.2587890625, 0.7587890625, 0.1337890625, 0.6337890625, 0.3837890625, 0.8837890625, 0.0712890625, 0.5712890625, 0.3212890625, 0.8212890625, 0.1962890625, 0.6962890625, 0.4462890625, 0.9462890625, 0.0400390625, 0.5400390625, 0.2900390625, 0.7900390625, 0.1650390625, 0.6650390625, 0.4150390625, 0.9150390625, 0.1025390625, 0.6025390625, 0.3525390625, 0.8525390625, 0.2275390625, 0.7275390625, 0.4775390625, 0.9775390625, 0.0244140625, 0.5244140625, 0.2744140625, 0.7744140625, 0.1494140625, 0.6494140625, 0.3994140625, 0.8994140625, 0.0869140625, 0.5869140625, 0.3369140625, 0.8369140625, 0.2119140625, 0.7119140625, 0.4619140625, 0.9619140625, 0.0556640625, 0.5556640625, 0.3056640625, 0.8056640625, 0.1806640625, 0.6806640625, 0.4306640625, 0.9306640625, 0.1181640625, 0.6181640625, 0.3681640625, 0.8681640625, 0.2431640625, 0.7431640625, 0.4931640625, 0.9931640625, 0.0048828125, 0.5048828125, 0.2548828125, 0.7548828125, 0.1298828125, 0.6298828125, 0.3798828125, 0.8798828125, 0.0673828125, 0.5673828125, 0.3173828125, 0.8173828125, 0.1923828125, 0.6923828125, 0.4423828125, 0.9423828125, 0.0361328125, 0.5361328125, 0.2861328125, 0.7861328125, 0.1611328125, 0.6611328125, 0.4111328125, 0.9111328125, 0.0986328125, 0.5986328125, 0.3486328125, 0.8486328125, 0.2236328125, 0.7236328125, 0.4736328125, 0.9736328125, 0.0205078125, 0.5205078125, 0.2705078125, 0.7705078125, 0.1455078125, 0.6455078125, 0.3955078125, 0.8955078125, 0.0830078125, 0.5830078125, 0.3330078125, 0.8330078125, 0.2080078125, 0.7080078125, 0.4580078125, 0.9580078125, 0.0517578125, 0.5517578125, 0.3017578125, 0.8017578125, 0.1767578125, 0.6767578125, 0.4267578125, 0.9267578125, 0.1142578125, 0.6142578125, 0.3642578125, 0.8642578125, 0.2392578125, 0.7392578125, 0.4892578125, 0.9892578125, 0.0126953125, 0.5126953125, 0.2626953125, 0.7626953125, 0.1376953125, 0.6376953125, 0.3876953125, 0.8876953125, 0.0751953125, 0.5751953125, 0.3251953125, 0.8251953125, 0.2001953125, 0.7001953125, 0.4501953125, 0.9501953125, 0.0439453125, 0.5439453125, 0.2939453125, 0.7939453125, 0.1689453125, 0.6689453125, 0.4189453125, 0.9189453125, 0.1064453125, 0.6064453125, 0.3564453125, 0.8564453125, 0.2314453125, 0.7314453125, 0.4814453125, 0.9814453125, 0.0283203125, 0.5283203125, 0.2783203125, 0.7783203125, 0.1533203125, 0.6533203125, 0.4033203125, 0.9033203125, 0.0908203125, 0.5908203125, 0.3408203125, 0.8408203125, 0.2158203125, 0.7158203125, 0.4658203125, 0.9658203125, 0.0595703125, 0.5595703125, 0.3095703125, 0.8095703125, 0.1845703125, 0.6845703125, 0.4345703125, 0.9345703125, 0.1220703125, 0.6220703125, 0.3720703125, 0.8720703125, 0.2470703125, 0.7470703125, 0.4970703125, 0.9970703125, 0.0029296875, 0.5029296875, 0.2529296875, 0.7529296875, 0.1279296875, 0.6279296875, 0.3779296875, 0.8779296875, 0.0654296875, 0.5654296875, 0.3154296875, 0.8154296875, 0.1904296875, 0.6904296875, 0.4404296875, 0.9404296875, 0.0341796875, 0.5341796875, 0.2841796875, 0.7841796875, 0.1591796875, 0.6591796875, 0.4091796875, 0.9091796875, 0.0966796875, 0.5966796875, 0.3466796875, 0.8466796875, 0.2216796875, 0.7216796875, 0.4716796875, 0.9716796875, 0.0185546875, 0.5185546875, 0.2685546875, 0.7685546875, 0.1435546875, 0.6435546875, 0.3935546875, 0.8935546875, 0.0810546875, 0.5810546875, 0.3310546875, 0.8310546875, 0.2060546875, 0.7060546875, 0.4560546875, 0.9560546875, 0.0498046875, 0.5498046875, 0.2998046875, 0.7998046875, 0.1748046875, 0.6748046875, 0.4248046875, 0.9248046875, 0.1123046875, 0.6123046875, 0.3623046875, 0.8623046875, 0.2373046875, 0.7373046875, 0.4873046875, 0.9873046875, 0.0107421875, 0.5107421875, 0.2607421875, 0.7607421875, 0.1357421875, 0.6357421875, 0.3857421875, 0.8857421875, 0.0732421875, 0.5732421875, 0.3232421875, 0.8232421875, 0.1982421875, 0.6982421875, 0.4482421875, 0.9482421875, 0.0419921875, 0.5419921875, 0.2919921875, 0.7919921875, 0.1669921875, 0.6669921875, 0.4169921875, 0.9169921875, 0.1044921875, 0.6044921875, 0.3544921875, 0.8544921875, 0.2294921875, 0.7294921875, 0.4794921875, 0.9794921875, 0.0263671875, 0.5263671875, 0.2763671875, 0.7763671875, 0.1513671875, 0.6513671875, 0.4013671875, 0.9013671875, 0.0888671875, 0.5888671875, 0.3388671875, 0.8388671875, 0.2138671875, 0.7138671875, 0.4638671875, 0.9638671875, 0.0576171875, 0.5576171875, 0.3076171875, 0.8076171875, 0.1826171875, 0.6826171875, 0.4326171875, 0.9326171875, 0.1201171875, 0.6201171875, 0.3701171875, 0.8701171875, 0.2451171875, 0.7451171875, 0.4951171875, 0.9951171875, 0.0068359375, 0.5068359375, 0.2568359375, 0.7568359375, 0.1318359375, 0.6318359375, 0.3818359375, 0.8818359375, 0.0693359375, 0.5693359375, 0.3193359375, 0.8193359375, 0.1943359375, 0.6943359375, 0.4443359375, 0.9443359375, 0.0380859375, 0.5380859375, 0.2880859375, 0.7880859375, 0.1630859375, 0.6630859375, 0.4130859375, 0.9130859375, 0.1005859375, 0.6005859375, 0.3505859375, 0.8505859375, 0.2255859375, 0.7255859375, 0.4755859375, 0.9755859375, 0.0224609375, 0.5224609375, 0.2724609375, 0.7724609375, 0.1474609375, 0.6474609375, 0.3974609375, 0.8974609375, 0.0849609375, 0.5849609375, 0.3349609375, 0.8349609375, 0.2099609375, 0.7099609375, 0.4599609375, 0.9599609375, 0.0537109375, 0.5537109375, 0.3037109375, 0.8037109375, 0.1787109375, 0.6787109375, 0.4287109375, 0.9287109375, 0.1162109375, 0.6162109375, 0.3662109375, 0.8662109375, 0.2412109375, 0.7412109375, 0.4912109375, 0.9912109375, 0.0146484375, 0.5146484375, 0.2646484375, 0.7646484375, 0.1396484375, 0.6396484375, 0.3896484375, 0.8896484375, 0.0771484375, 0.5771484375, 0.3271484375, 0.8271484375, 0.2021484375, 0.7021484375, 0.4521484375, 0.9521484375, 0.0458984375, 0.5458984375, 0.2958984375, 0.7958984375, 0.1708984375, 0.6708984375, 0.4208984375, 0.9208984375, 0.1083984375, 0.6083984375, 0.3583984375, 0.8583984375, 0.2333984375, 0.7333984375, 0.4833984375, 0.9833984375, 0.0302734375, 0.5302734375, 0.2802734375, 0.7802734375, 0.1552734375, 0.6552734375, 0.4052734375, 0.9052734375, 0.0927734375, 0.5927734375, 0.3427734375, 0.8427734375, 0.2177734375, 0.7177734375, 0.4677734375, 0.9677734375, 0.0615234375, 0.5615234375, 0.3115234375, 0.8115234375, 0.1865234375, 0.6865234375, 0.4365234375, 0.9365234375, 0.1240234375, 0.6240234375, 0.3740234375, 0.8740234375, 0.2490234375, 0.7490234375, 0.4990234375, 0.9990234375];

  function setPBMaterial(material, roughness, fresnel, diffuseColor, transparency) {
    var alpha = roughness * roughness;
    material = pbShader.clone();
    material.uniforms['u_lightColor'].value = new THREE.Vector3(0.90, 0.90, 0.90);
    material.uniforms['u_lightPos'].value = new THREE.Vector3(-10.0, 10.0, 100.0);
    material.uniforms['u_ambientColor'].value = new THREE.Vector3(34 / 255.0, 34 / 255.0, 34 / 255.0);
    material.uniforms['u_roughness'].value = roughness;
    material.uniforms['u_fresnel'].value = fresnel;
    material.uniforms['u_alpha'].value = alpha;
    material.uniforms['u_diffuseColor'].value = new THREE.Vector3(diffuseColor[0], diffuseColor[1], diffuseColor[2]);
    material.uniforms["u_VDC"].value = VDC;
    if(transparency != 1.0){
      material.transparent = true;
    }
    allPbShaders.push(material);
    return material;
  }



  for(var i = 0; i <= 10; i++) {
    var geometry = new THREE.SphereGeometry( 23, 32, 32 );
    var data = {map:null};
    var material = setPBMaterial(data, i/10, 0.7, [0.5,0.5,0.5], 1);
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = (i-6) * 50;
    scene.add( sphere );
  }

}




function init() {

  propertyGUI = new property();

  initShader();

  container = document.getElementById('container');
  container.appendChild( stats.domElement );
  document.body.appendChild(container);


  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3500 );
  camera.position.z = 270;
  camera.position.x = 5;
  camera.lightDir = new THREE.Vector3(-1,-1,-1);
  camera.lightDir.normalize();

  scene = new THREE.Scene();

  light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 0, 0, 100 );
  scene.add(light);

  cubeMapTex = initiCubeMap();

  boxGeo = new THREE.BoxGeometry(1,1,1);

  loader();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor( 0xffffff, 1 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  controller = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();
}

function render() {
  renderer.render( scene, camera );
}

function property() {
  this.roughness = 0.21;
  this.fresnel = 10.0;
  this.Normal_Dirstribution_Function = 'BlinnPhong';
  this.Geometric_Shadowing = 'CookTorrance';
  this.Cube_Map_Name = 'chapel/';
}

window.onload = function() {

  function roughnessCallback(value) {
    material.uniforms['u_roughness'].value = propertyGUI.roughness;
    material.uniforms['u_alpha'].value = propertyGUI.roughness * propertyGUI.roughness;
  }

  function fresnelCallback(value) {
    material.uniforms['u_fresnel'].value = propertyGUI.fresnel;
  }

  var datGui = new dat.GUI();
  var roughnessController = datGui.add(propertyGUI, 'roughness', 0.01, 1.0);
  roughnessController.onChange(roughnessCallback);
  roughnessController.onFinishChange(roughnessCallback);

  var fresnelController = datGui.add(propertyGUI, 'fresnel', 1.0, 20.0);
  fresnelController.onChange(fresnelCallback);
  fresnelController.onFinishChange(fresnelCallback);

  var NDFController = datGui.add(propertyGUI, 'Normal_Dirstribution_Function', ['BlinnPhong', 'Beckmann', 'GGX']);
  NDFController.onFinishChange(function(value){

    currentFragShader = BRDFFragmentShader.init
    + BRDFFragmentShader.N[propertyGUI.Normal_Dirstribution_Function]
    + BRDFFragmentShader.G[propertyGUI.Geometric_Shadowing]
    + BRDFFragmentShader.main;

    material.fragmentShader = currentFragShader;
    material.needsUpdate = true;

  })

  var GController = datGui.add(propertyGUI, 'Geometric_Shadowing', ['Implicit', 'CookTorrance', 'Kelemen', 'Beckmann', 'Schlick_Beckmann']);
  GController.onFinishChange(function(value){
    currentFragShader = BRDFFragmentShader.init
    + BRDFFragmentShader.N[propertyGUI.Normal_Dirstribution_Function]
    + BRDFFragmentShader.G[propertyGUI.Geometric_Shadowing]
    + BRDFFragmentShader.main;

    material.fragmentShader = currentFragShader;
    material.needsUpdate = true;
  })


  var cubeMapController = datGui.add(propertyGUI, 'Cube_Map_Name', ['chapel', 'beach', 'church']);
  cubeMapController.onFinishChange(function(value) {
    var cubeMapTex = initiCubeMap();
    for(var i = 0; i < allPbShaders.length; ++i) {
      allPbShaders[i].uniforms.u_tCube.value = cubeMapTex;
    }

  });
}


function initShader() {
  BRDFFragmentShader.init = document.getElementById( 'fragmentShader_param' ).textContent;

  BRDFFragmentShader.N = [];
  BRDFFragmentShader.N['BlinnPhong'] = document.getElementById( 'NDFBlinnPhong' ).textContent;
  BRDFFragmentShader.N['Beckmann'] = document.getElementById( 'NDFBeckmann' ).textContent;
  BRDFFragmentShader.N['GGX'] = document.getElementById( 'NDFGGX' ).textContent;

  BRDFFragmentShader.G = [];
  BRDFFragmentShader.G['Implicit'] = document.getElementById( 'GImplicit' ).textContent;
  BRDFFragmentShader.G['CookTorrance'] = document.getElementById( 'GCookTorrance' ).textContent;
  BRDFFragmentShader.G['Kelemen'] = document.getElementById( 'GKelemen' ).textContent;
  BRDFFragmentShader.G['Beckmann'] = document.getElementById( 'GBeckmann' ).textContent;
  BRDFFragmentShader.G['Schlick_Beckmann'] = document.getElementById( 'GSchlick_Beckmann' ).textContent;

  BRDFFragmentShader.main = document.getElementById( 'fragmentShader_main' ).textContent;

  currentFragShader = BRDFFragmentShader.init
  + BRDFFragmentShader.N['BlinnPhong']
  + BRDFFragmentShader.G['CookTorrance']
  + BRDFFragmentShader.main;
}


function initiCubeMap() {

  var urlPrefix = "./cubemap/";
  urlPrefix += propertyGUI.Cube_Map_Name + '/';

  var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
    urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
    urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
  var textureCube = THREE.ImageUtils.loadTextureCube( urls );
  textureCube.format = THREE.RGBFormat;

  var shader = THREE.ShaderLib["cube"];
  shader.uniforms['tCube'].value = textureCube;   // textureCube has been init before

  var material = new THREE.ShaderMaterial({
    fragmentShader    : shader.fragmentShader,
    vertexShader  : shader.vertexShader,
    uniforms  : shader.uniforms,
    depthWrite: false,
		side: THREE.BackSide
  });

  // build the skybox Mesh
  skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 2000, 2000, 2000 ), material );
  // add it to the scene
  scene.add( skyboxMesh );

  return textureCube;
}
