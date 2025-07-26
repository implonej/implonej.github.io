window.addEventListener('load', function() {
      setTimeout(() => {
        L2Dwidget.init({pluginRootPath:"live2dw/",pluginJsPath:"lib/",pluginModelPath:"assets/",tagMode:!1,debug:!1,model:{jsonPath:"/live2dw/assets/koharu.model.json"},display:{position:"right",width:150,height:300},mobile:{show:!1},log:!1});
      }, 250); // delay reload 1 seconds
    });