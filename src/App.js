import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import wordsToNumbers from "words-to-numbers";
import alanBtn from "@alan-ai/alan-sdk-web";

import logo from "./images/logo.png";
import logo_main from "./images/Alexa.jpg";
import { NewsCards } from "./components";
import useStyles from "./styles";

let api_key;

if (process.env.NODE_ENV !== "production") {
  api_key = process.env.REACT_APP_ALAN_API_KEY;
} else {
  api_key = process.env.ALAN_API_KEY;
}

const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: api_key,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > 20) {
            alanBtn().playText("Please try that again...");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          } else {
            alanBtn().playText("Please try that again...");
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Open article number [4]
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Go back
              </Typography>
            </div>
          </div>
        ) : null}
        <img src={logo_main} className={classes.alanLogo} alt="logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          {/*<Typography variant="body1" component="h2">
            Developed By - RV
      </Typography>*/}
          <a href="https://github.com/Rishabh-Varshney?tab=repositories">
            <img
              className={classes.image}
              src={logo}
              height="50px"
              alt="Github_Link"
            />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default App;
