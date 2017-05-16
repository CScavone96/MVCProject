let tweetRenderer;
let badTweetForm;
let lowTweetForm;
let gifTweetForm;
let incPanel;
let incUpgrade;
let avatarUpgrade;
let statsDiv;
let IncomeFormClass;
let IncomeUpgradeFormClass;
let AvatarUpgradeFormClass;
let BadTweetFormClass;
let LowTweetFormClass;
let GifTweetFormClass;
let StatsClass;
let TweetListClass;

const handleTweet = (e) => {
    e.preventDefault();
    
    $("#tweetMessage").animate({width:'hide'}, 350);
    var incomes = document.getElementsByClassName("tweetIncome");
    let bcount = 1;
    for(let i = 0; i < incomes.length; i++){
        if(incomes[i].innerHTML.substring(0,1) === "1"){
            bcount++;
        }
    }
    let cost = bcount * bcount * 10;
    let newCost = (bcount+1) * (bcount+1) * 10;
    sendAjax('POST', $("#badTweetForm").attr("action"), $("#badTweetForm").serialize(), function(){
      tweetRenderer.loadTweetsFromServer();
      $("#credDisplay").html(parseInt($('#credDisplay').html())-cost);
      $("#badCost").html(newCost);
    });
    
    return false;
}

const handleLowTweet = (e) => {
    e.preventDefault();
    
    $("#tweetMessage").animate({width:'hide'}, 350);
    var incomes = document.getElementsByClassName("tweetIncome");
    let lcount = 1;
    for(let i = 0; i < incomes.length; i++){
        if(incomes[i].innerHTML.substring(0,1) === "2"){
            lcount++;
        }
    }
    let cost = lcount * lcount * 50;
    let newCost = (lcount+1) * (lcount+1) * 50;
    sendAjax('POST', $("#lowTweetForm").attr("action"), $("#lowTweetForm").serialize(), function(){
      tweetRenderer.loadTweetsFromServer();
      $("#credDisplay").html(parseInt($('#credDisplay').html())-cost);
      $("#lowCost").html(newCost);
    });
    
    return false;
}


const handleGifTweet = (e) => {
    e.preventDefault();
    
    $("#tweetMessage").animate({width:'hide'}, 350);
    
    if($("#tag").val() == ''){
        handleError("Tag is required");
        return false;
    } 
    var incomes = document.getElementsByClassName("tweetIncome");
    let gcount = 1;
    for(let i = 0; i < incomes.length; i++){
        if(incomes[i].innerHTML.substring(0,1) === "5"){
            gcount++;
        }
    }
    let cost = gcount * gcount * 100;
    let newCost = (gcount+1) * (gcount+1) * 100;
    sendAjax('POST', $("#gifTweetForm").attr("action"), $("#gifTweetForm").serialize(), function(){
      tweetRenderer.loadTweetsFromServer();
      $("#credDisplay").html(parseInt($('#credDisplay').html())-cost);
      $("#gifCost").html(newCost);
    });
    
    return false;
}

const handleAvatarUpgrade = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#avaUpgrade").attr("action"), $("#avaUpgrade").serialize(), function(){
        const avatarPow = parseInt($('#avatarPow').html()) + 1;
        $("#credDisplay").html(parseInt($('#credDisplay').html())-parseInt($('#avatarCost').html()));
        $("#avatarPow").html(avatarPow);
        $("#avatarCost").html((avatarPow+1) * (avatarPow+1) * 1000);
        location.reload();
    });
    return false;
}

const handleIncome = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#incPanel").attr("action"), $("#incPanel").serialize(), function(){
        $("#credDisplay").html(parseInt($('#credDisplay').html())+parseInt($('#spamPow').html()));
    });
    return false;
}

const handleIncomeUpgrade = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#incUpgrade").attr("action"), $("#incUpgrade").serialize(), function(){
        const spamPow = parseInt(parseInt($('#spamPow').html()) + 1);
        let newCost = spamPow * spamPow * 75;
        $("#spamPow").html(spamPow);
        $("#credDisplay").html(parseInt($('#credDisplay').html())-parseInt($('#spamCost').html()));
        $("#spamCost").html(newCost);
    });
    return false;
}

const renderIncome = function(){
     if(this.state.data.length === 0){
        return(
        <form id="incPanel"            
          name ="panel"
          onSubmit = {this.handleSubmit}
          action = "/addCredit"
          method = "POST">
        <label>Spam Power: </label> 
        <label id="spamPow">1</label>
        <label>|</label>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
        <input id="doSpam" className="makeSubmit" type="submit" value="Spam your account" />
        </form>
        );
    }
    
    const csrf = this.props.csrf;
    const func = this;
    const incNodes = this.state.data.map(function(account){
        return(
        <form key={account._id} id="incPanel"            
          name ="panel"
          onSubmit = {func.handleSubmit}
          action = "/addCredit"
          method = "POST">
        <label>Spam Power: </label> 
        <label id="spamPow">{account.spamPower}</label>
        <label>|</label>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input id="doSpam" className="makeSubmit" type="submit" value="Spam your account" />
        </form>
        );
    });
    
    return (
      <div>
        {incNodes}
      </div>
    );
};


const renderIncomeUpgrade = function(){
    if(this.state.data.length === 0){
        return(
        <form id="incUpgrade"            
              name ="panel"
              onSubmit = {this.handleSubmit}
              action = "/upgradeSpam"
              method = "POST">
            <label htmlFor="spamCost">Upgrade Cost: </label> 
            <label id="spamCost">100</label>
            <label>|</label>
            <input type="hidden" name="_csrf" value={this.props.csrf}/>
            <input id="spamUpgrade" className="makeSubmit" type="submit" value="Upgrade your spam" />
        </form>);
    }
    const csrf = this.props.csrf;
    const func = this;
    const incNodes = this.state.data.map(function(account){
        let cost = account.spamPower * account.spamPower * 75;
        return(
        <form key={account._id}  id="incUpgrade"            
              name ="panel"
              onSubmit = {func.handleSubmit}
              action = "/upgradeSpam"
              method = "POST">
            <label htmlFor="spamCost">Upgrade Cost: </label> 
            <label id="spamCost">{cost}</label>
            <label>|</label>
            <input type="hidden" name="_csrf" value={csrf}/>
            <input id="spamUpgrade" className="makeSubmit" type="submit" value="Upgrade your spam" />
        </form>
        );
    });
    
    return (
      <div>
        {incNodes}
      </div>
    );
};


const renderAvatarUpgrade = function(){
    if(this.state.data.length === 0){
        return(
        <form id="avaUpgrade"            
          name ="panel"
          onSubmit = {this.handleSubmit}
          action = "/upgradeAvatar"
          method = "POST">
        <label>Avatar Power: </label> 
        <label id="avatarPow">0</label>
        <label>|</label>
        <label>Upgrade Cost: </label> 
        <label id="avatarCost">0</label>
        <label>|</label>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
        <input id="doAvatar" className="makeSubmit" type="submit" value="Upgrade your avatar" />
        </form>
        );
    }
    
    const csrf = this.props.csrf;
    const func = this;
    
    const avatarNodes = this.state.data.map(function(account){
        return(
        <form key={account._id} id="avaUpgrade"            
          name ="panel"
          onSubmit = {func.handleSubmit}
          action = "/upgradeAvatar"
          method = "POST">
        <label>Avatar Power: </label> 
        <label id="avatarPow">{account.avatarPower}</label>
        <label>|</label>
        <label>Upgrade Cost: </label> 
        <label id="avatarCost">{(account.avatarPower+1)*(account.avatarPower+1)*1000}</label>
        <label>|</label>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input id="doAvatar" className="makeSubmit" type="submit" value="Upgrade your avatar" />
        </form>
        );
    });
    
    return (
      <div>
        {avatarNodes}
      </div>
    );
};

const renderStats = function(){
    if(this.state.data.length === 0){
        return (
        <section>
          <label>Impressions: </label> 
          <label id="credDisplay">0</label>
          <label>|</label>
          <label>Followers: </label>
          <label id="incomeDisplay">0</label>
        </section>
        );
    }
    
    const statsNodes = this.state.data.map(function(account){
        return(
        <section key={account._id} >
          <label>Impressions: </label> 
          <label id="credDisplay">{account.impressions}</label>
          <label>|</label>
          <label>Followers: </label>
          <label id="incomeDisplay">0</label>
        </section>
        );
    });
    
    return (
      <section>
        {statsNodes}
      </section>
    );

};

const renderBadTweet = function(){
    const csrf = this.props.csrf;
    let i = 0;
    const tweets = this.state.data;
    let badCost = 1;
    for(i =0; i < tweets.length; i++){
        console.log(tweets[i].income);
        if(tweets[i].income === 1){
            badCost++;
        }
    }
    badCost = badCost * badCost * 10;
    return(
    <form id="badTweetForm"            
          name ="panel"
          action = "/tweetBad"
          onSubmit = {this.handleSubmit}
          method = "POST"
          className = "panel">
        <label>Cost: </label> 
        <label id="badCost">{badCost}</label>
        <label>|</label>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input className="makeSubmit" type="submit" value="Tweet at a friend" />
    </form>
    );
};

const renderLowTweet = function(){
    const csrf = this.props.csrf;
    let i = 0;
    const tweets = this.state.data;
    let lowCost = 1;
    for(i =0; i < tweets.length; i++){
        console.log(tweets[i].income);
        if(tweets[i].income === 2){
            lowCost++;
        }
    }
    lowCost = lowCost * lowCost * 50;
    return(
    <form id="lowTweetForm"            
          name ="panel"
          action = "/tweetLow"
          onSubmit = {this.handleSubmit}
          method = "POST"
          className = "panel">
        <label>Cost: </label> 
        <label id="lowCost">{lowCost}</label>
        <label>|</label>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input className="makeSubmit" type="submit" value="Tweet about cats" />
    </form>
    );
};

const renderGifTweet = function(){
    const csrf = this.props.csrf;
    let i = 0;
    const tweets = this.state.data;
    let gifCost = 1;
    for(i =0; i < tweets.length; i++){
        console.log(tweets[i].income);
        if(tweets[i].income === 5){
            gifCost++;
        }
    }
    gifCost = gifCost * gifCost * 100;
    return(
    <form id="gifTweetForm"            
          name ="panel"
          action = "/tweetGif"
          onSubmit = {this.handleSubmit}
          method = "POST"
          className = "panel">
        <label>Cost: </label> 
        <label id="gifCost">{gifCost}</label>
        <label>|</label>
        <label htmlFor="tag">Gif Topic: </label>
        <input id="gifTag" type="text" name="tag" placeholder="Ex. pixel art, walrus..."/>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input className="makeSubmit" type="submit" value="Tweet a GIF" />
    </form>
    );
};

const renderTweetList = function(){
    if(this.state.data.length === 0){
        return (
        <div className="tweetList">
          <h3 className ="emptyTweet"> No Tweets yet</h3>
        </div>
        );
    }
    const func = this;
    const tweetNodes = this.state.tweetdata.map(function(tweet){
        let avatar = func.state.data[0].avatar;
        let avatarPow = func.state.data[0].avatarPower;
        let avaSrc = "";
        if(avatar === -1){
            avaSrc = "/assets/img/egg.jpg";
        }
        else{
            avaSrc = "https://unsplash.it/200?image=" + avatar;
        }
        console.log(avaSrc);
        if(tweet.income == 5){
           return(
            <div key={tweet._id} className="tweet">
              <img src={avaSrc} alt="userAvatar" className="tweetFace"/>
              <p className = "tweetAcc">{tweet.username} </p>
              <p className = "tweetAt">@{tweet.username}</p>
              <p className = "tweetIncome">{tweet.income + " + " + avatarPow}</p>
              <img className = "tweetImg" src = {tweet.textContents}/>        
            </div>
            ); 
        }
        return(
        <div key={tweet._id} className="tweet">
          <img src={avaSrc} alt="userAvatar" className="tweetFace"/>
          <p className = "tweetAcc">{tweet.username} </p>
          <p className = "tweetAt">@{tweet.username}</p>
          <p className = "tweetIncome">{tweet.income + " + " + avatarPow}</p>
          <p className = "tweetText">{tweet.textContents}</p>        
        </div>
        );
    });
    
    return (
      <div className="tweetList">
        {tweetNodes}
      </div>
    );
};

const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#tweetMessage").animate({width:'toggle'},350);
}

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      $("#tweetMessage").animate({width:'hide'},350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
}

$(document).ready(() => {
  $("#signupForm").on("submit", (e) => {
    e.preventDefault();

    $("#tweetMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("Passwords do not match");
      return false;           
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();

    $("#tweetMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("sername or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });
  
  $("#badTweetForm").on("submit", (e) => {
    e.preventDefault();

    $("#tweetMessage").animate({width:'hide'},350);

    sendAjax($("#badTweetForm").attr("action"), $("#badTweetForm").serialize());

    return false;
  });
  
  $("#lowTweetForm").on("submit", (e) => {
    e.preventDefault();

    $("#tweetMessage").animate({width:'hide'},350);

    sendAjax($("#lowTweetForm").attr("action"), $("#lowTweetForm").serialize());

    return false;
  });
  
  $("#gifTweetForm").on("submit", (e) => {
    e.preventDefault();

    $("#tweetMessage").animate({width:'hide'},350);

    sendAjax($("#gifTweetForm").attr("action"), $("#gifTweetForm").serialize());

    return false;
  });
});

const setup = function(csrf) {
  BadTweetFormClass = React.createClass({
      handleSubmit: handleTweet,
      loadCost: function(){
        sendAjax('GET', '/getTweets', null, function(data) {
            this.setState({data:data.tweets});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadCost();
      },
      render: renderBadTweet
  });
  
  LowTweetFormClass = React.createClass({
      handleSubmit: handleLowTweet,
      loadCost: function(){
        sendAjax('GET', '/getTweets', null, function(data) {
            this.setState({data:data.tweets});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadCost();
      },
      render: renderLowTweet
  });
  
  GifTweetFormClass = React.createClass({
      handleSubmit: handleGifTweet,
      loadCost: function(){
        sendAjax('GET', '/getTweets', null, function(data) {
            this.setState({data:data.tweets});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadCost();
      },
      render: renderGifTweet
  });
  
  AvatarUpgradeFormClass = React.createClass({
      handleSubmit: handleAvatarUpgrade,      
      loadAccount: function(){
        sendAjax('GET', '/getAccount', null, function(data) {
            this.setState({data:data.account});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadAccount();
      },
      render: renderAvatarUpgrade
  });
  
  StatsClass = React.createClass({
      loadAccount: function(){
        sendAjax('GET', '/getAccount', null, function(data) {
            this.setState({data:data.account});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadAccount();
      },
      render: renderStats
  });
  
  IncomeFormClass = React.createClass({   
      loadAcco: function(){
        sendAjax('GET', '/getAccount', null, function(data) {
            console.log(data.account);
            this.setState({data:data.account});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadAcco();
      },
      handleSubmit: handleIncome,   
      render: renderIncome
  });
  
  IncomeUpgradeFormClass = React.createClass({
      handleSubmit: handleIncomeUpgrade,      
      loadAccount: function(){
        sendAjax('GET', '/getAccount', null, function(data) {
            this.setState({data:data.account});
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadAccount();
      },
      render: renderIncomeUpgrade
  });
  
  TweetListClass = React.createClass({
      loadTweetsFromServer: function(){
        sendAjax('GET', '/getTweets', null, function(data) {
            let func = this;
            let tweetData = data.tweets;            
            sendAjax('GET', '/getAccount', null, function(data) {
                func.setState({data:data.account, tweetdata: tweetData});
                });
        }.bind(this))
      },
      getInitialState: function(){
          return {data: []};
      },
      componentDidMount: function(){
          this.loadTweetsFromServer();
      },
      render: renderTweetList
  });
  
  incPanel = ReactDOM.render(
    <IncomeFormClass csrf={csrf}/>, document.querySelector("#income")
    );
    
  incUpgrade = ReactDOM.render(
    <IncomeUpgradeFormClass csrf={csrf}/>, document.querySelector("#incomeUpgrade")
    );
    
  statsDiv = ReactDOM.render(
    <StatsClass />, document.querySelector("#stats")
    );
    
  avatarUpgrade = ReactDOM.render(
    <AvatarUpgradeFormClass csrf={csrf}/>, document.querySelector("#avatarUpgrade")
    );
  
  badTweetForm = ReactDOM.render(
    <BadTweetFormClass csrf={csrf}/>, document.querySelector("#makeBadTweet")
    );
    
  lowTweetForm = ReactDOM.render(
    <LowTweetFormClass csrf={csrf}/>, document.querySelector("#makeLowTweet")
    );
    
  gifTweetForm = ReactDOM.render(
    <GifTweetFormClass csrf={csrf}/>, document.querySelector("#makeGifTweet")
    );
    
  tweetRenderer = ReactDOM.render(
    <TweetListClass />, document.querySelector("#tweets")
    );
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function() {
    getToken();
});