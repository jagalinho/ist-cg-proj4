var cube;
var cube_materials, cube_curr_material_index = 0;

function createCubeMaterials() {
    'use strict';
    let textures = [new THREE.TextureLoader().load('assets/rubiks_cube/1.png'),
        new THREE.TextureLoader().load('assets/rubiks_cube/2.png'),
        new THREE.TextureLoader().load('assets/rubiks_cube/3.png'),
        new THREE.TextureLoader().load('assets/rubiks_cube/4.png'),
        new THREE.TextureLoader().load('assets/rubiks_cube/5.png'),
        new THREE.TextureLoader().load('assets/rubiks_cube/6.png')];
    let material_properties = {
        side: THREE.DoubleSide
    };
    let phong_properties = {...material_properties,
        bumpMap: new THREE.TextureLoader().load('assets/rubiks_cube/bmap.png')
    };

    cube_materials = [[new THREE.MeshPhongMaterial({...phong_properties, map: textures[0]}),
            new THREE.MeshPhongMaterial({...phong_properties, map: textures[1]}),
            new THREE.MeshPhongMaterial({...phong_properties, map: textures[2]}),
            new THREE.MeshPhongMaterial({...phong_properties, map: textures[3]}),
            new THREE.MeshPhongMaterial({...phong_properties, map: textures[4]}),
            new THREE.MeshPhongMaterial({...phong_properties, map: textures[5]})],
        [new THREE.MeshBasicMaterial({...material_properties, map: textures[0]}),
            new THREE.MeshBasicMaterial({...material_properties, map: textures[1]}),
            new THREE.MeshBasicMaterial({...material_properties, map: textures[2]}),
            new THREE.MeshBasicMaterial({...material_properties, map: textures[3]}),
            new THREE.MeshBasicMaterial({...material_properties, map: textures[4]}),
            new THREE.MeshBasicMaterial({...material_properties, map: textures[5]})]];
}

function createCube(x, y, z, size) {
    'use strict';
    createCubeMaterials();
    cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), cube_materials[cube_curr_material_index]);

    cube.position.set(x, y + size/2, z);

    return cube;
}

function toggleCubeBasicMaterial() {
    'use strict';
    cube_curr_material_index = cube_curr_material_index ? 0 : 1;
    cube.material = cube_materials[cube_curr_material_index];
}

function toggleCubeWireframe() {
    'use strict';
    cube_materials.forEach(material_set => material_set.forEach(material => material.wireframe = !material.wireframe));
}

function getCubePosition() {
    'use strict';
    return cube.position.clone();
}

function resetCube() {
    'use strict';
    cube_materials.forEach(material_set => material_set.forEach(material => material.wireframe = false));
    cube_curr_material_index = 0;
    cube.material = cube_materials[cube_curr_material_index]
}