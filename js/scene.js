var scene, renderer;
var camera, camera_controls, camera_rot_speed = 2;
var clock;

var paused = false, pause_scene, pause_camera, pause_camera_view_size = 1.2;

var directional_light, directional_light_intensity = 0.7;
var point_light, point_light_intensity = 0.5;

function createScene() {
    'use strict';
    scene = new THREE.Scene();

    directional_light = new THREE.DirectionalLight(0xffffff, directional_light_intensity);
    directional_light.position.set(-50, 50, -50);
    point_light = new THREE.PointLight(0xffffff, point_light_intensity, 0, 2);
    point_light.position.set(0, 30, 0);
    scene.add(directional_light, point_light);

    scene.add(createBoard(0, 0, 0, 100, 2),
        createBall(20, 2, 20, 5),
        createCube(0, 2, 0, 15));
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-70, 50, 0);
    camera.lookAt(scene.position);

    camera_controls = new THREE.OrbitControls(camera);
    camera_controls.autoRotate = true;
    camera_controls.autoRotateSpeed = camera_rot_speed;
}

function createPause() {
    'use strict';
    pause_scene = new THREE.Scene();
    pause_scene.add(new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.TextureLoader().load('assets/pause_overlay.png')})));

    let aspect_ratio = window.innerWidth / window.innerHeight;
    let horizontal = aspect_ratio * pause_camera_view_size, vertical = pause_camera_view_size;
    pause_camera = new THREE.OrthographicCamera(-horizontal/2, horizontal/2, vertical/2, -vertical/2, 0, 1);
}

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        let aspect_ratio = window.innerWidth / window.innerHeight;

        let scaling = window.innerWidth < 1250 ? 1250 / window.innerWidth : 1;
        camera.aspect = aspect_ratio;
        camera.zoom = 1 / scaling;
        camera.updateProjectionMatrix();

        let pause_camera_scaling = window.innerWidth < 750 ? 750 / window.innerWidth : 1;
        let horizontal = aspect_ratio * pause_camera_view_size * pause_camera_scaling, vertical = pause_camera_view_size * pause_camera_scaling;
        pause_camera.left = -horizontal/2;
        pause_camera.right = horizontal/2;
        pause_camera.top = vertical/2;
        pause_camera.bottom = -vertical/2;
        pause_camera.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';
    if (!paused) {
        switch (e.keyCode) {
            case 68:    //D
            case 100:   //d
                directional_light.intensity = directional_light.intensity ? 0 : directional_light_intensity;
                break;
            case 80:    //P
            case 112:   //p
                point_light.intensity = point_light.intensity ? 0 : point_light_intensity;
                break;
            case 87:    //W
            case 119:   //w
                toggleBoardWireframe();
                toggleBallWireframe();
                toggleCubeWireframe();
                break;
            case 76:    //L
            case 108:   //l
                toggleBoardBasicMaterial();
                toggleBallBasicMaterial();
                toggleCubeBasicMaterial();
                break;
            case 66:    //B
            case 98:    //b
                toggleBallMovement();
                break;
            case 79:    //o
            case 111:   //O
                camera_controls.autoRotate = !camera_controls.autoRotate;
                break;
            case 83:    //S
            case 115:   //s
                togglePause();
                break;
        }
    } else {
        switch (e.keyCode) {
            case 83:    //S
            case 115:   //s
                togglePause();
                break;
            case 82:    //R
            case 114:   //r
                reset();
                togglePause();
                break;
        }
    }
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();
   
    createScene();
    createCamera();
    createPause();
    onResize();

    initBallMovement();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}

function animate() {
    'use strict';
    let delta = clock.getDelta();
    camera_controls.update();
    simulateBallMovement(delta);
    renderer.clear();
    renderer.render(scene, camera);
    if (paused) {
        renderer.clearDepth();
        renderer.render(pause_scene, pause_camera);
    } else
        requestAnimationFrame(animate);
}

function togglePause() {
    'use strict';
    paused = !paused;
    if (paused)
        camera_controls.enabled = false;
    else {
        camera_controls.enabled = true;
        clock.getDelta();
        requestAnimationFrame(animate);
    }
}

function reset() {
    'use strict';
    camera_controls.reset();
    camera_controls.autoRotate = true;
    resetBoard();
    resetBall();
    resetCube();
}