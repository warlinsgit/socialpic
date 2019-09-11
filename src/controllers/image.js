//https://www.youtube.com/watch?v=TqC3e8nBycg&t=3960s
const fs = require('fs-extra');
const path = require('path');
 const md5 = require('md5');
 const ctrl = {};
const { randomNumber } =require('../helpers/libs');

const {Image, Comment } = require('../models');
const sidebar = require('../helpers/sidebar');


ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: {} };

  const image = await Image.findOne({filename: { $regex: req.params.image_id }});
  if (image) {
    image.views = image.views + 1;
    viewModel.image = image;
    await image.save();
    const comments = await Comment.find({image_id: image._id});

    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    await sidebar(viewModel);
    res.render('image', viewModel);
  } else {
    res.redirect('/');
  }
};

ctrl.create =  (req, res) => {
  //console.log(req.file);
const saveImage = async () => {

  const imgUrl = randomNumber();
  const images = await Image.find({filename: imgUrl});
  if(images.length > 0){
        saveImage()
  }else {



  const imageTempPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

  if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif'){
    await fs.rename(imageTempPath, targetPath);
    const newImg  = new Image({
      title: req.body.title,
      filename: imgUrl + ext,
      description: req.body.description

    });
const imageSaved = await newImg.save();
res.redirect('/images/' + imageSaved.uniqueId);
//res.send('works');
  //console.log(newImg);

}else{
  await fs.unlink(imageTempPath);
  res.status(500).json({error: 'Only images is allowed'});


    }
  }


};
  saveImage();
};




ctrl.like =  async(req, res) => {

  const image = await Image.findOne({filename: {$regex: req.params.image_id}})
  if(image){
    image.likes = image.likes + 1;
    await image.save();
    res.json({likes: image.likes});
  }else {
    res.status(500).json({error: 'Internal Error'});
  }

};





ctrl.comment= async (req, res) => {
  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect('/images/' + image.uniqueId + '#' + newComment._id);
  } else {
    res.redirect('/');
  }
};

ctrl.remove = async (req, res) => {
  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
   if(image){
    await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
    await Comment.deleteOne({image_id: image._id});
    await image.remove();
    res.json(true);
   }

};



module.exports = ctrl;
//https://www.youtube.com/watch?v=TqC3e8nBycg&t=300s
