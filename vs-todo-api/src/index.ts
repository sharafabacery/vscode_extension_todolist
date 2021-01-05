import "reflect-metadata"
require('dotenv-safe').config()
import express from "express";
import {createConnection} from 'typeorm'
import { __prod__ } from "./constants";
import { join } from "path";
//import { User } from "./entities/User";
import {Strategy as GitHubStrategy} from 'passport-github';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cors from "cors";
import { User } from "./entities/User";
import { Todo } from "./entities/Todo";
import { isAuth } from "./isAuth";


const main=async()=>{
    await  createConnection({
        type:'postgres',
        database:'vstodo',
        entities:[join(__dirname,'./entities/*.*')],
        username:"postgres",
        password:"root1234",
        logging:!__prod__,
        synchronize:!__prod__
    })
    // const user=await User.create({name:'sharaf'}).save()
    // console.log(user)
    const app=express()
     passport.serializeUser((user:any, done)=> {
        done(null, user.accessToken);
      });
    app.use(cors({origin:'*'}));
    app.use(express.json())
    app.use(passport.initialize());
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback"
      },
      async(_, __, profile, cb)=> {
          let user=await User.findOne({where:{githubId:profile.id}});
          console.log(profile)
            if (user) {
                user.name=profile.displayName
                await user.save()
            }else{
                user=await User.create({name:profile.displayName,githubId:profile.id}).save();

            }
          
        cb(null,{accessToken:jwt.sign({userId:user.id},process.env.jwt_secret,{expiresIn:'1h'}),refreshToken:""})
      }
    ));
    //point to it
    app.get('/auth/github',
    passport.authenticate('github',{session:false}));
   app.get('/me',async(req,res)=>{
      const authHeader =req.headers.authorization;
      if (!authHeader) {
        res.send({user:null})
        return
      }
      const token=authHeader.split(" ")[1];
      if (!token) {
        res.send({user:null})
        return
      }
      let userId;
      try {
       const payload:any= jwt.verify(token,process.env.jwt_secret)
       userId=payload.userId 
       
      } catch (error) {
        res.send({user:null})
        return
      }
      if (!userId) {
        res.send({user:null})
        return
      }
      const user =await User.findOne(userId)
      res.send({user})
   })
  app.get('/auth/github/callback', 
    passport.authenticate('github',{session:false}),
    function(req:any, res) {
      // Successful authentication, redirect home.
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`)
    });

    app.post('/todo',isAuth,async(req:any,res)=>{
      //{}
    const todo= await Todo.create({text:req.body.text,creatorId:req.userId} ).save();
    res.send({todo});
    })
    app.put('/todo',isAuth,async(req:any,res)=>{
      //{}
      const todo=await Todo.findOne(req.body.id)
      if (!todo) {
        res.send({todo:null})
        return
      }
      if (todo.creatorId !==req.userId) {
        throw new Error('not authorized')
      }
      todo.completed=!todo.completed
      await todo.save()
     res.send({todo});
    })
    app.get('/todo',isAuth,async(req,res)=>{
      const todos=await Todo.find({where:{creatorId:req.userId},order:{id:"DESC"}});
      res.send({todos})
    })

    app.listen(3002,()=>{
        console.log('ok')
    })
}

main();