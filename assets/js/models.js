// The two CAD models on the site, as parts in their assembled places.
// pack: the baked file (studio/bake_web.py). Each part: [name in the pack, material, { rx: extra x-rotation in degrees, o: offset in mm, ex: where it moves when taken
// apart (mm), g: group the case pages point at, label: name shown beside it when its group is in focus,
// side: 'l' | 'r' to force which side the label goes (default: away from the middle) }]
export const MODELS = {
  camera: {
    pack: 'assets/models/camera.bin', zUp: false, yaw: -0.55, pitch: 0.16,
    parts: [
      ['01_front_shell', 'clay', { rx: 180, ex: [0, 0, 22], g: 'shell', label: '앞 쉘' }],
      ['02_back_shell', 'clay', { ex: [0, 0, -26], g: 'shell', label: '뒤 쉘' }],
      ['03_lens_sleeve', 'graphite', { rx: 180, o: [45.5, 8.47, 0], ex: [0, 0, 48], g: 'lens' }],
      ['04_lens_ring1', 'clay', { o: [45.5, 8.47, 20], ex: [0, 0, 64], g: 'lens' }],
      ['05_lens_ring2', 'graphite', { o: [45.5, 8.47, 23], ex: [0, 0, 78], g: 'lens', label: '경통 링 3개' }],
      ['06_lens_ring3', 'clay', { rx: 180, o: [45.5, 8.47, 31.8], ex: [0, 0, 92], g: 'lens' }],
      ['07_shutter_cap', 'clay', { rx: 90, o: [-46, 35.7, 8.5], ex: [0, 26, 0], g: 'top', label: '2단 셔터' }],
      ['08_zoom_ring', 'clay', { rx: 90, o: [-46, 39.05, 8.5], ex: [0, 38, 0], g: 'top', label: '줌 링' }],
      ['09_power_cap', 'clay', { rx: 90, o: [-8, 35.7, 8.5], ex: [0, 26, 0], g: 'top', label: '전원' }],
      ['10_mode_dial', 'clay', { rx: 90, o: [46, 39.2, 6.5], ex: [0, 32, 0], g: 'top', label: '모드 다이얼 4단' }],
      ['14_viewfinder_tube', 'graphite', { o: [31, 31.5, -13.5], ex: [0, 16, -42], g: 'hand', label: '뷰파인더' }],
      ['15_flash_diffuser', 'clay', { o: [-18, 30, 17.5], ex: [0, 8, 40], g: 'hand', label: '플래시 창' }],
      ['16_grip', 'graphite', { o: [-51, -8, 20], ex: [-22, 0, 34], g: 'hand', label: '그립' }],
      ['x_module', 'gloss', { o: [45.5, 8.47, 9], ex: [0, 0, 34], g: 'lens', label: 'IMX219 · 8MP' }],
      ['x_cover_glass', 'glass', { o: [45.5, 8.47, 30], ex: [0, 0, 108], g: 'lens', label: '커버 글라스' }],
    ],
  },
  controller: {
    pack: 'assets/models/controller.bin', zUp: true, yaw: -0.3, pitch: 0.78,
    parts: [
      ['bottom', 'clay', { g: 'shell', label: '아랫판' }],
      ['top', 'frost', { ex: [0, 58, 0], g: 'shell', label: '윗판 · 투명' }],
      ['dpad', 'graphite', { ex: [0, 80, 0], g: 'btn', label: '십자키' }],
      ['btn_a', 'graphite', { ex: [0, 80, 0], g: 'btn', label: 'A' }],
      ['btn_b', 'graphite', { ex: [0, 80, 0], g: 'btn', label: 'B' }],
      ['start', 'graphite', { ex: [0, 80, 0], g: 'btn', label: 'Start · Select', side: 'r' }],
      ['select', 'graphite', { ex: [0, 80, 0], g: 'btn' }],
      ['part_battery', 'part', { ex: [0, 6, 0], g: 'elec', label: '503450 LiPo', side: 'r' }],
      ['part_xiao', 'part', { ex: [0, 6, 0], g: 'elec', label: 'XIAO ESP32-S3' }],
      ['part_amp', 'part', { ex: [0, 6, 0], g: 'elec', label: 'MAX98357A' }],
      ['part_charger', 'part', { ex: [0, 14, 0], g: 'elec', label: 'USB-C 충전' }],
      ['part_speaker', 'graphite', { ex: [0, 44, 0], g: 'elec', label: '스피커 28 mm' }],
      ['part_switches', 'part', { ex: [0, 14, 0], g: 'elec' }],
      ['part_boards', 'part', { ex: [0, 26, 0], g: 'elec' }],
      ['part_tacts', 'graphite', { ex: [0, 32, 0], g: 'btn' }],
    ],
  },
};
