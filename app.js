const Discord = require("discord.js");
const fs = require("fs");
var readline = require('readline');
var kdt = require("kd.tree");



/*{example
var coords = [
  { name: 'Gramercy Theatre',
    loc: {lat: '40.739683', long: '73.985151'} },
  { name: 'Blue Note Jazz Club',
    loc: {lat: '40.730601', long: '74.000447'} },
  { name: 'Milk Studios',
    loc: {lat: '40.742256', long: '74.006344'} },
  { name: 'Greenroom Brooklyn',
    loc: {lat: '40.691805', long: '73.908089'} }
].map(function (v) {
  return v.loc
})

var distance = function(a, b){
  return Math.pow(a.lat - b.lat, 2) +  Math.pow(a.long - b.long, 2);
}

var tree = kdt.createKdTree(coords, distance, ['lat', 'long'])

var nearest = tree.nearest({ lat: 40, long: 75 }, 4);

console.log(nearest.reverse());
//}*/


const client=new Discord.Client();
//const subjects=require('./subjects.json');

var lines=0;
var dictionary={};
var wordData=[];
var tree;
function dif(a,b){
	var sum=0;
	for(var i=a.vec.length-1;i>=0;i--){
		var c=a.vec[i]-b.vec[i];
		sum+=c*c;
	}
	return(sum);
};
readline.createInterface({
    input: fs.createReadStream('dictionary.vec'),
    terminal: false
}).on('line', function(line) {
	var data=line.split(' ');
	var word=data.shift();
	data.pop();
	var data=eval('['+data.join(',')+']');
	dictionary[word]=data;
	wordData.push({word:word,vec:data});
	if(lines%10000==0){console.log((lines/10000)+'%');}
	lines++;
}).on('close', function(line) {
	tree=kdt.createKdTree(wordData, dif, ['word', 'vec']);
	console.log('Dictionary made');
	client.login('NDE4ODEzNjMyMjEwNzk2NTU0.DXnCcg.ctvfcgun7GqV2tQwNC7_AHI5pVY');
});

const pre="!";

//{functions
function DM(id,msg){
	client.fetchUser(id).then(x=>x.send(msg));
};

function save(a,b){
	let data = JSON.stringify(a,null,2);
	
	fs.writeFile('./'+b, data, (err) => {  
		if (err) throw err;
		//console.log('User data saved.');
	});
};

function dist(a,b){
	var sum=0;
	for(var i=a.length-1;i>=0;i--){
		var c=a[i]-b[i];
		sum+=c*c;
	}
	return(Math.sqrt(sum));
};
//}

//{commands
const help={
	echo:'syntax: echo <message>\nreplies with <message>',
	help:'syntax: help <command*>\nprovides help on either all commands or a specified command',
	ping:'syntax: ping\nreplies with "pong"',
};
const GeneralCommands={
	emote:function(msg,args){
		return('<'+msg.content.split(' ')[1]+'>');
	},
	version:function(){
		return("https://github.com/EFHIII/Natural-Language");
	},/*
	help:function(msg,args){
		if(args.length===0){
			msg.author.send("```md\nHelp\n====\n * The prefix "+pre+" must be used at the beginning of any bot command *\n\n"+
			"General Commands\n================\n"+
				"echo  <message>- have the bot repeat a phrase\n\n"+
				"help <command*> - The help command, with an optional command specific help argument\n\n"+
				"ping - responds with 'pong'\n\n"+
				"rng <sides> - rolls an n sided die, default is 6'\n\n"+
				"stats <username*> - gives you stats on a given user. Default is yourself\n\n"+
				"version - links the bot's source code\n\n"+
			"Utility Commands\n================\n"+
				"subjects - lists all valid mentor subjects\n\n"+
				"mentor <mentor-command*> - a prefix for all the mentor commands; for more details: "+pre+"help mentor\n\n"+
			"Game Commands\n=============\n"+
				"bank - tells you how much you have in your bank\n\n"+
				"game list - lists the currently supported games\n\n"+
				"give <user> <amount> - gives the specified user the specified amount of credit from your account\n\n"+
				"new game <game> <buy-in*> - creates a new open game of the game specified (chosen from the game list)\n\n"+
				"open games - lists all open games\n\n"+
				"join <@host> - lets you join a game with a given game host\n\n"+
				"quit game - lets you quit and forfeit a game you're in"+
			"\n```");
			return('Check your DMs.');
		}
		else{
			if(help[args[0]]){
				return(help[args[0]]);
			}
			else{return(args[0]+' is not a supported function.');}
		}
	},
	*/
	ping:function(){
		return('Ping!');
	},
	echo:function(msg,args){
		if(args.join(' ')===''){
			return('*silence*');
		}
		return(msg.content.replace(pre+'echo ',''));
	},
	rng:function(msg,args){
		if(args.length===0){
			return('You rolled a '+Math.floor(Math.random()*6+1)+'!');
		}
		else{
			return('You rolled a '+Math.floor(Math.random()*parseInt(args[0])+1)+'!');
		}
	},
	dif:function(msg,args){
		//console.log(JSON.stringify(dictionary[args[0]]));
		
		if(args.length>1&&dictionary.hasOwnProperty(args[0])&&dictionary.hasOwnProperty(args[1])){
			return(dist(dictionary[args[0]],dictionary[args[1]]));
		}
		else{
			return(args[0]+" and/or "+args[1]+" isn't in my dictionary.");
		}
	},
	close:function(msg,args){
		if(dictionary.hasOwnProperty(args[0])){
			var closest=tree.nearest({word:'',vec:dictionary[args[0]]},2);
			//console.log(JSON.stringify(closest));
			return('The next closest word in my database is "'+closest[1][0].word+'"');
		}
		else{
			return(args[0]+" isn't in my dictionary.");
		}
	},
};
const devCommands={
	dif:function(msg,args){
		//console.log(JSON.stringify(dictionary[args[0]]));
		
		if(args.length>1&&dictionary.hasOwnProperty(args[0])&&dictionary.hasOwnProperty(args[1])){
			return(dist(dictionary[args[0]],dictionary[args[1]]));
		}
		else{
			return(args[0]+" and/or "+args[1]+" isn't in my dictionary.");
		}
	},
};
//}

//{client events
client.on('ready', () => {
	console.log(`${client.user.tag} online`);
	client.user.setGame(`human`);
});

client.on("guildCreate", guild => {
	console.log(`joined ${guild.name} (id: ${guild.id})`);
});

client.on("guildDelete", guild => {
	console.log(`left ${guild.name} (id: ${guild.id})`);
});

client.on('message', msg => {
	//console.log(msg.author.tag+": "+msg.content);
	if(msg.author.bot){return;}
	//let m=msg.content.toLowerCase();
	if(m[0]!==pre){
		if(m[0]==='-'){
			m=m.substr(1,m.length-2);
			/*
			if(msg.guild&&users.hasOwnProperty(msg.author.id)&&users[msg.author.id].current.hasOwnProperty(msg.guild.id)){
				let txt=gameAction(games[msg.guild.id][users[msg.author.id].current[msg.guild.id]],m,msg.author.id);
				if(Array.isArray(txt)){
					for(let i=0;i<txt.length;i++){
						msg.channel.send(txt[i]);
					}
				}
				else{
					msg.channel.send(txt);
				}
			}*/
		}
		return;
	};
	m=m.substr(1);
	m = m.split(" ");
	let cmd=m.shift();
	if(GeneralCommands.hasOwnProperty(cmd)){
		let txt=(GeneralCommands[cmd](msg,m));
		if(Array.isArray(txt)){
			for(let i=0;i<txt.length;i++){
				msg.channel.send(txt[i]);
			}
		}
		else{
			msg.channel.send(txt);
		}
		return;
	}
	
	if(msg.author.id!=134800705230733312){
		return;
	}
	if(devCommands.hasOwnProperty(cmd)){
		let txt=devCommands[cmd](msg,m);
		if(Array.isArray(txt)){
			for(let i=0;i<txt.length;i++){
				msg.channel.send(txt[i]);
			}
		}
		else{
			msg.channel.send(txt);
		}
		return;
	}
});

//}

