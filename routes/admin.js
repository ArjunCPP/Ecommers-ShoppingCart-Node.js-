const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
/* GET home page. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((product)=>{
    console.log(product);
    res.render('admin/view-product', {product, admin: true });
  })
});
router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);  

  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err);
      }
    })
  })
})
  router.get('/delete-product/:id',(req,res)=>{
    let proId=req.params.id
    console.log(proId)
    productHelpers.deleteProduct(proId).then((response)=>{
      res.redirect('/admin/')
    })
  })
  router.get('/edit-product/:id',async(req,res)=>{
    let product=await productHelpers.getProductDetails(req.params.id)
    console.log(product);
    res.render('admin/edit-product',{product})
  })
  router.post('/edit-product/:id',(req,res)=>{
    console.log(req.params.id);
    let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
    res.redirect('/admin')
  })
  })
module.exports = router;