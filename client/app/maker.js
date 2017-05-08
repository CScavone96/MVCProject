let tweetRenderer;
let badTweetForm;
let lowTweetForm;
let incPanel;
let incUpgrade;
let avatarUpgrade;
let statsDiv;
let IncomeFormClass;
let IncomeUpgradeFormClass;
let AvatarUpgradeFormClass;
let BadTweetFormClass;
let LowTweetFormClass;
let StatsClass;
let TweetListClass;

const handleTweet = (e) => {
    e.preventDefault();
    
    $("#tweetMessage").animate({width:'hide'}, 350);
    var incomes = document.getElementsByClassName("tweetIncome");
    let bcount = 1;
    for(let i = 0; i < incomes.length; i++){
        if(incomes[i].innerHTML === "1"){
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
        if(incomes[i].innerHTML === "2"){
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

const renderAvatarUpgrade = function(){
    const csrf = this.props.csrf;
    if(this.state.data.length === 0){
        return(
        <form id="avatarUpgrade"            
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
        <input type="hidden" name="_csrf" value={csrf}/>
        <input id="doAvatar" className="makeSubmit" type="submit" value="Upgrade your avatar" />
        </form>
        );
    }
    const func = this;
    const incNodes = this.state.data.map(function(account){
        return(
        <form key={account._id} id="avatarUpgrade"            
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
        {incNodes}
      </div>
    );
};

const handleAvatarUpgrade = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#avatarUpgrade").attr("action"), $("#avatarUpgrade").serialize(), function(){

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
        const spamPow = parseInt($('#spamPow').html());
        $("#spamPow").html(spamPow+1);
        $("#credDisplay").html(parseInt($('#credDisplay').html())-parseInt($('#spamCost').html()));
        $("#spamCost").html(spamPow * spamPow * 75);
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
        console.log(avatar);
        let avaSrc = "";
        if(avatar === -1){
            avaSrc = "/assets/img/egg.jpg";
        }
        console.log(avaSrc);
        return(
        <div key={tweet._id} className="tweet">
          <img src={avaSrc} alt="userAvatar" className="tweetFace"/>
          <p className = "tweetAcc">{tweet.username} </p>
          <p className = "tweetAt">@{tweet.username}</p>
          <p className = "tweetIncome">{tweet.income}</p>
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