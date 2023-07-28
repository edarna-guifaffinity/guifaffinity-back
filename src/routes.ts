import { Meme } from "DatabaseSchema";
import { Request, Response, Router } from "express";
import { Gif } from "model/gif.model";

export const routes = Router();

routes.get("/gifs", (req: Request, res: Response) => {
  const title: string | undefined = req.query.title?.toString();
  const db = req.context.db;
  let memes;

  if (title === undefined) {
    memes = db.get("memes").take(50).value();
  } else {
    memes = db.get("memes").value();
    memes = memes.filter((meme) =>
      meme.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  const gifs: Gif[] = memes.map((meme) => gifMapper(meme));

  if (gifs.length === 0) {
    res.status(204).json(error);
    return;
  }

  res.status(200).json(gifs);
});

routes.get("/gifs/:idGif", (req, res) => {
  const idGif: string = req.params.idGif;
  const db = req.context.db;
  const meme = db.get("memes").find({ id: idGif }).value();

  if (meme === undefined) {
    res.status(204).json(error);
    return;
  }

  const gif = gifMapper(meme);

  res.status(200).json(gif);
});

function gifMapper(meme: Meme): Gif {
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

  return gif;
}

const error = {
  description: "No results avaliable",
};
