const axios = require('axios');

const products = [
  { productId: "ON-001", name: "Cloud 5", gender: "男", shoeType: "路跑鞋", scenario: "城市路跑", lastWidth: "标准", runningStage: "入门", positioning: "日常训练", cushioning: "中", stability: "中", sensitivity: "中", weightHint: "通用" },
  { productId: "ON-002", name: "Cloudmonster", gender: "男", shoeType: "路跑鞋", scenario: "城市路跑", lastWidth: "标准", runningStage: "进阶", positioning: "缓震取向", cushioning: "高", stability: "中", sensitivity: "中", weightHint: "偏重" },
  { productId: "ON-003", name: "Cloudflow", gender: "女", shoeType: "路跑鞋", scenario: "城市路跑", lastWidth: "窄", runningStage: "进阶", positioning: "性能取向", cushioning: "中", stability: "低", sensitivity: "高", weightHint: "偏轻" },
  { productId: "ON-004", name: "Cloudstratus", gender: "男", shoeType: "路跑鞋", scenario: "城市路跑", lastWidth: "标准", runningStage: "进阶", positioning: "日常训练", cushioning: "高", stability: "高", sensitivity: "低", weightHint: "偏重" },
  { productId: "ON-005", name: "Cloudboom Echo", gender: "男", shoeType: "路跑鞋", scenario: "城市路跑", lastWidth: "窄", runningStage: "备赛", positioning: "性能取向", cushioning: "中", stability: "低", sensitivity: "高", weightHint: "偏轻" }
];

async function importProducts() {
  for (const p of products) {
    try {
      const res = await axios.post('http://localhost:3000/api/products', p);
      console.log('Created:', p.productId, p.name);
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

importProducts();
