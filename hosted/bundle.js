"use strict";

var tweetRenderer = void 0;
var badTweetForm = void 0;
var lowTweetForm = void 0;
var incPanel = void 0;
var incUpgrade = void 0;
var avatarUpgrade = void 0;
var statsDiv = void 0;
var IncomeFormClass = void 0;
var IncomeUpgradeFormClass = void 0;
var AvatarUpgradeFormClass = void 0;
var BadTweetFormClass = void 0;
var LowTweetFormClass = void 0;
var StatsClass = void 0;
var TweetListClass = void 0;

var handleTweet = function handleTweet(e) {
    e.preventDefault();

    $("#tweetMessage").animate({ width: 'hide' }, 350);
    var incomes = document.getElementsByClassName("tweetIncome");
    var bcount = 1;
    for (var i = 0; i < incomes.length; i++) {
        if (incomes[i].innerHTML === "1") {
            bcount++;
        }
    }
    var cost = bcount * bcount * 10;
    var newCost = (bcount + 1) * (bcount + 1) * 10;
    sendAjax('POST', $("#badTweetForm").attr("action"), $("#badTweetForm").serialize(), function () {
        tweetRenderer.loadTweetsFromServer();
        $("#credDisplay").html(parseInt($('#credDisplay').html()) - cost);
        $("#badCost").html(newCost);
    });

    return false;
};

var handleLowTweet = function handleLowTweet(e) {
    e.preventDefault();

    $("#tweetMessage").animate({ width: 'hide' }, 350);
    var incomes = document.getElementsByClassName("tweetIncome");
    var lcount = 1;
    for (var i = 0; i < incomes.length; i++) {
        if (incomes[i].innerHTML === "2") {
            lcount++;
        }
    }
    var cost = lcount * lcount * 50;
    var newCost = (lcount + 1) * (lcount + 1) * 50;
    sendAjax('POST', $("#lowTweetForm").attr("action"), $("#lowTweetForm").serialize(), function () {
        tweetRenderer.loadTweetsFromServer();
        $("#credDisplay").html(parseInt($('#credDisplay').html()) - cost);
        $("#lowCost").html(newCost);
    });

    return false;
};

var renderAvatarUpgrade = function renderAvatarUpgrade() {
    var csrf = this.props.csrf;
    if (this.state.data.length === 0) {
        return React.createElement(
            "form",
            { id: "avatarUpgrade",
                name: "panel",
                onSubmit: this.handleSubmit,
                action: "/upgradeAvatar",
                method: "POST" },
            React.createElement(
                "label",
                null,
                "Avatar Power: "
            ),
            React.createElement(
                "label",
                { id: "avatarPow" },
                "0"
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement(
                "label",
                null,
                "Upgrade Cost: "
            ),
            React.createElement(
                "label",
                { id: "avatarCost" },
                "0"
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "doAvatar", className: "makeSubmit", type: "submit", value: "Upgrade your avatar" })
        );
    }
    var func = this;
    var incNodes = this.state.data.map(function (account) {
        return React.createElement(
            "form",
            { key: account._id, id: "avatarUpgrade",
                name: "panel",
                onSubmit: func.handleSubmit,
                action: "/upgradeAvatar",
                method: "POST" },
            React.createElement(
                "label",
                null,
                "Avatar Power: "
            ),
            React.createElement(
                "label",
                { id: "avatarPow" },
                account.avatarPower
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement(
                "label",
                null,
                "Upgrade Cost: "
            ),
            React.createElement(
                "label",
                { id: "avatarCost" },
                (account.avatarPower + 1) * (account.avatarPower + 1) * 1000
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "doAvatar", className: "makeSubmit", type: "submit", value: "Upgrade your avatar" })
        );
    });

    return React.createElement(
        "div",
        null,
        incNodes
    );
};

var handleAvatarUpgrade = function handleAvatarUpgrade(e) {
    e.preventDefault();
    sendAjax('POST', $("#avatarUpgrade").attr("action"), $("#avatarUpgrade").serialize(), function () {});
    return false;
};

var handleIncome = function handleIncome(e) {
    e.preventDefault();
    sendAjax('POST', $("#incPanel").attr("action"), $("#incPanel").serialize(), function () {
        $("#credDisplay").html(parseInt($('#credDisplay').html()) + parseInt($('#spamPow').html()));
    });
    return false;
};

var handleIncomeUpgrade = function handleIncomeUpgrade(e) {
    e.preventDefault();
    sendAjax('POST', $("#incUpgrade").attr("action"), $("#incUpgrade").serialize(), function () {
        var spamPow = parseInt($('#spamPow').html());
        $("#spamPow").html(spamPow + 1);
        $("#credDisplay").html(parseInt($('#credDisplay').html()) - parseInt($('#spamCost').html()));
        $("#spamCost").html(spamPow * spamPow * 75);
    });
    return false;
};

var renderIncome = function renderIncome() {
    if (this.state.data.length === 0) {
        return React.createElement(
            "form",
            { id: "incPanel",
                name: "panel",
                onSubmit: this.handleSubmit,
                action: "/addCredit",
                method: "POST" },
            React.createElement(
                "label",
                null,
                "Spam Power: "
            ),
            React.createElement(
                "label",
                { id: "spamPow" },
                "1"
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
            React.createElement("input", { id: "doSpam", className: "makeSubmit", type: "submit", value: "Spam your account" })
        );
    }

    var csrf = this.props.csrf;
    var func = this;
    var incNodes = this.state.data.map(function (account) {
        return React.createElement(
            "form",
            { key: account._id, id: "incPanel",
                name: "panel",
                onSubmit: func.handleSubmit,
                action: "/addCredit",
                method: "POST" },
            React.createElement(
                "label",
                null,
                "Spam Power: "
            ),
            React.createElement(
                "label",
                { id: "spamPow" },
                account.spamPower
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "doSpam", className: "makeSubmit", type: "submit", value: "Spam your account" })
        );
    });

    return React.createElement(
        "div",
        null,
        incNodes
    );
};

var renderIncomeUpgrade = function renderIncomeUpgrade() {
    if (this.state.data.length === 0) {
        return React.createElement(
            "form",
            { id: "incUpgrade",
                name: "panel",
                onSubmit: this.handleSubmit,
                action: "/upgradeSpam",
                method: "POST" },
            React.createElement(
                "label",
                { htmlFor: "spamCost" },
                "Upgrade Cost: "
            ),
            React.createElement(
                "label",
                { id: "spamCost" },
                "100"
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
            React.createElement("input", { id: "spamUpgrade", className: "makeSubmit", type: "submit", value: "Upgrade your spam" })
        );
    }
    var csrf = this.props.csrf;
    var func = this;
    var incNodes = this.state.data.map(function (account) {
        var cost = account.spamPower * account.spamPower * 75;
        return React.createElement(
            "form",
            { key: account._id, id: "incUpgrade",
                name: "panel",
                onSubmit: func.handleSubmit,
                action: "/upgradeSpam",
                method: "POST" },
            React.createElement(
                "label",
                { htmlFor: "spamCost" },
                "Upgrade Cost: "
            ),
            React.createElement(
                "label",
                { id: "spamCost" },
                cost
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
            React.createElement("input", { id: "spamUpgrade", className: "makeSubmit", type: "submit", value: "Upgrade your spam" })
        );
    });

    return React.createElement(
        "div",
        null,
        incNodes
    );
};

var renderStats = function renderStats() {
    if (this.state.data.length === 0) {
        return React.createElement(
            "section",
            null,
            React.createElement(
                "label",
                null,
                "Impressions: "
            ),
            React.createElement(
                "label",
                { id: "credDisplay" },
                "0"
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement(
                "label",
                null,
                "Followers: "
            ),
            React.createElement(
                "label",
                { id: "incomeDisplay" },
                "0"
            )
        );
    }

    var statsNodes = this.state.data.map(function (account) {
        return React.createElement(
            "section",
            { key: account._id },
            React.createElement(
                "label",
                null,
                "Impressions: "
            ),
            React.createElement(
                "label",
                { id: "credDisplay" },
                account.impressions
            ),
            React.createElement(
                "label",
                null,
                "|"
            ),
            React.createElement(
                "label",
                null,
                "Followers: "
            ),
            React.createElement(
                "label",
                { id: "incomeDisplay" },
                "0"
            )
        );
    });

    return React.createElement(
        "section",
        null,
        statsNodes
    );
};

var renderBadTweet = function renderBadTweet() {
    var csrf = this.props.csrf;
    var i = 0;
    var tweets = this.state.data;
    var badCost = 1;
    for (i = 0; i < tweets.length; i++) {
        console.log(tweets[i].income);
        if (tweets[i].income === 1) {
            badCost++;
        }
    }
    badCost = badCost * badCost * 10;
    return React.createElement(
        "form",
        { id: "badTweetForm",
            name: "panel",
            action: "/tweetBad",
            onSubmit: this.handleSubmit,
            method: "POST",
            className: "panel" },
        React.createElement(
            "label",
            null,
            "Cost: "
        ),
        React.createElement(
            "label",
            { id: "badCost" },
            badCost
        ),
        React.createElement(
            "label",
            null,
            "|"
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
        React.createElement("input", { className: "makeSubmit", type: "submit", value: "Tweet at a friend" })
    );
};

var renderLowTweet = function renderLowTweet() {
    var csrf = this.props.csrf;
    var i = 0;
    var tweets = this.state.data;
    var lowCost = 1;
    for (i = 0; i < tweets.length; i++) {
        console.log(tweets[i].income);
        if (tweets[i].income === 2) {
            lowCost++;
        }
    }
    lowCost = lowCost * lowCost * 50;
    return React.createElement(
        "form",
        { id: "lowTweetForm",
            name: "panel",
            action: "/tweetLow",
            onSubmit: this.handleSubmit,
            method: "POST",
            className: "panel" },
        React.createElement(
            "label",
            null,
            "Cost: "
        ),
        React.createElement(
            "label",
            { id: "lowCost" },
            lowCost
        ),
        React.createElement(
            "label",
            null,
            "|"
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
        React.createElement("input", { className: "makeSubmit", type: "submit", value: "Tweet about cats" })
    );
};

var renderTweetList = function renderTweetList() {
    if (this.state.data.length === 0) {
        return React.createElement(
            "div",
            { className: "tweetList" },
            React.createElement(
                "h3",
                { className: "emptyTweet" },
                " No Tweets yet"
            )
        );
    }
    var func = this;
    var tweetNodes = this.state.tweetdata.map(function (tweet) {
        var avatar = func.state.data[0].avatar;
        console.log(avatar);
        var avaSrc = "";
        if (avatar === -1) {
            avaSrc = "/assets/img/egg.jpg";
        }
        console.log(avaSrc);
        return React.createElement(
            "div",
            { key: tweet._id, className: "tweet" },
            React.createElement("img", { src: avaSrc, alt: "userAvatar", className: "tweetFace" }),
            React.createElement(
                "p",
                { className: "tweetAcc" },
                tweet.username,
                " "
            ),
            React.createElement(
                "p",
                { className: "tweetAt" },
                "@",
                tweet.username
            ),
            React.createElement(
                "p",
                { className: "tweetIncome" },
                tweet.income
            ),
            React.createElement(
                "p",
                { className: "tweetText" },
                tweet.textContents
            )
        );
    });

    return React.createElement(
        "div",
        { className: "tweetList" },
        tweetNodes
    );
};

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#tweetMessage").animate({ width: 'toggle' }, 350);
};

var sendAjax = function sendAjax(action, data) {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function success(result, status, xhr) {
            $("#tweetMessage").animate({ width: 'hide' }, 350);

            window.location = result.redirect;
        },
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);

            handleError(messageObj.error);
        }
    });
};

$(document).ready(function () {
    $("#signupForm").on("submit", function (e) {
        e.preventDefault();

        $("#tweetMessage").animate({ width: 'hide' }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }

        if ($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

        return false;
    });

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        $("#tweetMessage").animate({ width: 'hide' }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '') {
            handleError("sername or password is empty");
            return false;
        }

        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });

    $("#badTweetForm").on("submit", function (e) {
        e.preventDefault();

        $("#tweetMessage").animate({ width: 'hide' }, 350);

        sendAjax($("#badTweetForm").attr("action"), $("#badTweetForm").serialize());

        return false;
    });

    $("#lowTweetForm").on("submit", function (e) {
        e.preventDefault();

        $("#tweetMessage").animate({ width: 'hide' }, 350);

        sendAjax($("#lowTweetForm").attr("action"), $("#lowTweetForm").serialize());

        return false;
    });
});

var setup = function setup(csrf) {
    BadTweetFormClass = React.createClass({
        displayName: "BadTweetFormClass",

        handleSubmit: handleTweet,
        loadCost: function loadCost() {
            sendAjax('GET', '/getTweets', null, function (data) {
                this.setState({ data: data.tweets });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadCost();
        },
        render: renderBadTweet
    });

    LowTweetFormClass = React.createClass({
        displayName: "LowTweetFormClass",

        handleSubmit: handleLowTweet,
        loadCost: function loadCost() {
            sendAjax('GET', '/getTweets', null, function (data) {
                this.setState({ data: data.tweets });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadCost();
        },
        render: renderLowTweet
    });

    AvatarUpgradeFormClass = React.createClass({
        displayName: "AvatarUpgradeFormClass",

        handleSubmit: handleAvatarUpgrade,
        loadAccount: function loadAccount() {
            sendAjax('GET', '/getAccount', null, function (data) {
                this.setState({ data: data.account });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadAccount();
        },
        render: renderAvatarUpgrade
    });

    StatsClass = React.createClass({
        displayName: "StatsClass",

        loadAccount: function loadAccount() {
            sendAjax('GET', '/getAccount', null, function (data) {
                this.setState({ data: data.account });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadAccount();
        },
        render: renderStats
    });

    IncomeFormClass = React.createClass({
        displayName: "IncomeFormClass",

        loadAcco: function loadAcco() {
            sendAjax('GET', '/getAccount', null, function (data) {
                console.log(data.account);
                this.setState({ data: data.account });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadAcco();
        },
        handleSubmit: handleIncome,
        render: renderIncome
    });

    IncomeUpgradeFormClass = React.createClass({
        displayName: "IncomeUpgradeFormClass",

        handleSubmit: handleIncomeUpgrade,
        loadAccount: function loadAccount() {
            sendAjax('GET', '/getAccount', null, function (data) {
                this.setState({ data: data.account });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadAccount();
        },
        render: renderIncomeUpgrade
    });

    TweetListClass = React.createClass({
        displayName: "TweetListClass",

        loadTweetsFromServer: function loadTweetsFromServer() {
            sendAjax('GET', '/getTweets', null, function (data) {
                var func = this;
                var tweetData = data.tweets;
                sendAjax('GET', '/getAccount', null, function (data) {
                    func.setState({ data: data.account, tweetdata: tweetData });
                });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadTweetsFromServer();
        },
        render: renderTweetList
    });

    incPanel = ReactDOM.render(React.createElement(IncomeFormClass, { csrf: csrf }), document.querySelector("#income"));

    incUpgrade = ReactDOM.render(React.createElement(IncomeUpgradeFormClass, { csrf: csrf }), document.querySelector("#incomeUpgrade"));

    statsDiv = ReactDOM.render(React.createElement(StatsClass, null), document.querySelector("#stats"));

    avatarUpgrade = ReactDOM.render(React.createElement(AvatarUpgradeFormClass, { csrf: csrf }), document.querySelector("#avatarUpgrade"));

    badTweetForm = ReactDOM.render(React.createElement(BadTweetFormClass, { csrf: csrf }), document.querySelector("#makeBadTweet"));

    lowTweetForm = ReactDOM.render(React.createElement(LowTweetFormClass, { csrf: csrf }), document.querySelector("#makeLowTweet"));

    tweetRenderer = ReactDOM.render(React.createElement(TweetListClass, null), document.querySelector("#tweets"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.Parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
