import { Request, Response, Router } from "express";
import { Gif } from "model/gif.model";

export const routes = Router();

routes.get("/gifs", (req: Request, res: Response) => {
  const db = req.context.db;
  const memes = db.get("memes").take(50).value();
  const gifs: Gif[] = memes.map((meme) => {
    const user: Gif["user"] = {
      avatar: "",
      name: "",
    };
    if (meme.user != undefined) {
      user.avatar = meme.user.avatar_url;
      user.name = meme.user.display_name;
    }

    return {
      id: meme.id,
      src: meme.images.original.url,
      tags: meme.tags,
      title: meme.title,
      user: user,
    };
  });

  res.status(200).json(gifs);
});

routes.get("/gifs/:idGif", (req, res) => {
  const idGif: string = req.params.idGif;
  const db = req.context.db;
  const meme = db.get("memes").find({ id: idGif }).value();

  if (meme === undefined) {
    res.status(404).send();
    return;
  }

  const user: Gif["user"] = {
    avatar: "",
    name: "",
  };
  if (meme.user != undefined) {
    user.avatar = meme.user.avatar_url;
    user.name = meme.user.display_name;
  }

  const gif: Gif = {
    id: meme.id,
    src: meme.images.original.url,
    title: meme.title,
    tags: meme.tags,
    user: user,
  };

  res.status(200).json(gif);
});
