var board;
var board_materials, board_curr_material_index = 0;

function createBoardMaterials() {
    'use strict';
    let texture = new THREE.TextureLoader().load('assets/chess_board.png');
    let material_properties = {
        side: THREE.DoubleSide
    };

    let phong_material = new THREE.MeshPhongMaterial({...material_properties, color: 0x814d37, shininess: 0});
    let basic_material = new THREE.MeshBasicMaterial({...material_properties, color: 0x814d37});
    board_materials = [[phong_material, phong_material,
            new THREE.MeshPhongMaterial({...material_properties, map: texture, shininess: 0}),
            phong_material, phong_material, phong_material],
        [basic_material, basic_material,
            new THREE.MeshBasicMaterial({...material_properties, map: texture}),
            basic_material, basic_material, basic_material]];
}

function createBoard(x, y, z, size, height) {
    'use strict';
    createBoardMaterials();
    board = new THREE.Mesh(new THREE.CubeGeometry(size, height, size), board_materials[board_curr_material_index]);

    board.position.set(x, y + height/2, z);

    return board;
}

function toggleBoardBasicMaterial() {
    'use strict';
    board_curr_material_index = board_curr_material_index ? 0 : 1;
    board.material = board_materials[board_curr_material_index];
}

function toggleBoardWireframe() {
    'use strict';
    board_materials.forEach(material_set => {
        material_set[0].wireframe = !material_set[0].wireframe;
        material_set[2].wireframe = !material_set[2].wireframe;
    });
}

function resetBoard() {
    'use strict';
    board_materials.forEach(material_set => {
        material_set[0].wireframe = false;
        material_set[2].wireframe = false;
    });
    board_curr_material_index = 0;
    board.material = board_materials[board_curr_material_index];
}