var ball, ball_radius, ball_speed, ball_init_pos;
var ball_materials, ball_curr_material_index = 0;
var ball_accel = 0.2, deaccel_mul = 3, ball_max_speed = 2*Math.PI, ball_min_speed = 0, ball_rot_pos, ball_rot_center, ball_rot_radius;

function createBallMaterials() {
    'use strict';
    let material_properties = {
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('assets/billiards_ball.png')
    };

    ball_materials = [new THREE.MeshPhongMaterial({...material_properties,
            specular: 0x666666,
            shininess: 35}),
        new THREE.MeshBasicMaterial({...material_properties})];
}

function initBallMovement() {
    ball_accel *= -deaccel_mul;
    ball_max_speed = Math.min(Math.max(ball_max_speed, 0), 2*Math.PI);
    ball_min_speed = Math.max(Math.min(ball_max_speed, ball_min_speed), 0);
    ball_speed = ball_min_speed;
    ball_rot_pos = 2*Math.PI;
    ball_rot_center = getCubePosition().setY(ball.position.y);
    ball_rot_radius = ball.position.distanceTo(ball_rot_center);
}

function createBall(x, y, z, radius) {
    'use strict';
    createBallMaterials();
    ball_radius = radius;
    ball = new THREE.Mesh(new THREE.SphereGeometry(ball_radius, ball_radius*4, ball_radius*4), ball_materials[ball_curr_material_index]);

    ball_init_pos = new THREE.Vector3(x, y + ball_radius, z);
    ball.position.copy(ball_init_pos);

    return ball;
}

function simulateBallMovement(delta) {
    'use strict';
    ball_speed = Math.min(Math.max(ball_speed + ball_accel*delta, ball_min_speed), ball_max_speed);
    ball_rot_pos -= ball_speed*delta;
    if (ball_rot_pos < 0)
        ball_rot_pos = 2*Math.PI + ball_rot_pos;

    ball.rotateOnWorldAxis(ball.position.clone().sub(ball_rot_center).normalize(),
            (ball_rot_radius*ball_speed*delta) / ball_radius)
        .position.setX(ball_rot_center.x + ball_rot_radius*Math.sin(ball_rot_pos))
            .setZ(ball_rot_center.z + ball_rot_radius*Math.cos(ball_rot_pos));
}

function toggleBallBasicMaterial() {
    'use strict';
    ball_curr_material_index = ball_curr_material_index ? 0 : 1;
    ball.material = ball_materials[ball_curr_material_index];
}

function toggleBallMovement() {
    'use strict';
    ball_accel *= ball_accel >= 0 ? -deaccel_mul : -1/deaccel_mul;
}

function toggleBallWireframe() {
    'use strict';
    ball_materials.forEach(material => material.wireframe = !material.wireframe);
}

function resetBall() {
    'use strict';
    ball_materials.forEach(material => material.wireframe = false);
    ball_curr_material_index = 0;
    ball.material = ball_materials[ball_curr_material_index];

    ball.position.copy(ball_init_pos);
    ball.rotation.set(0, 0, 0);
    ball_accel *= ball_accel >= 0 ? -deaccel_mul : 1;
    ball_speed = ball_min_speed;
    ball_rot_pos = 0;
}