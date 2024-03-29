const Discord=require("discord.js");
const client=new Discord.Client({partials:["MESSAGE","CHANNEL","REACTION"]});
const fs=require("fs");
const http=require("http");
const socketio_client=require("socket.io-client");
require("dotenv");

const prefix=process.env.prefix||"^";
const _owners=process.env.owners?process.env.owners.split(","):["748531954391056445"];

client.once("ready",async()=>{
console.log(`Logged-in as ${client.user.tag}`);
client.user.setActivity(`polls | ${prefix}help`,{type:"WATCHING"});
});

client.on("message",async(message)=>{
if(!message.author.bot&&message.content.startsWith(`<@!${client.user.id}>`)){
var embed=new Discord.MessageEmbed()
.setColor("#00aa33")
.setDescription(`Hello!\r\nI am Opinion, a bot that allows you to create polls and votes!\r\nMy command prefix is \`${prefix}\`.\r\nYou can try typing \`${prefix}help\` to retrieve a list of commands that you can use.`);
message.channel.send(`||${message.author}||`,embed);
}
if(message.content.startsWith(prefix)&&!message.author.bot){
var command=message.content.substring(prefix.length,message.content.length);
var args=command.split(" ");

if(command.toLowerCase().startsWith("help")){
var embed=new Discord.MessageEmbed()
.setColor("#0077dd")
.setTitle("Help/Commands | :passport_control:")
.setFooter("Help/Commands | Opinion")
.setDescription(`Here's a list of commands you can use:\r\n\`<\` and \`>\` means mandatory values\r\n\`[\` and \`]\` means optional values\r\n\`|\` means a choice.`)
.addFields(
{name:"`help`",value:`Will retrieve you a list of commands.\r\n**Usage**: \`${prefix}help\``,inline:true},
{name:"`thumbs`",value:`Will put a thumbsup :thumbsup: and a thumbsdown :thumbsdown: reactions to the message.\r\n**Usage**: \`${prefix}thumbs <your message>\`\r\n**Example**: \`${prefix}thumbs Do you like the bot?\``,inline:true},
{name:"`thumbsId`",value:`Will put a thumbsup :thumbsup: and a thumbsdown :thumbsdown: reactions to the provided message.\r\n**Usage**: \`${prefix}thumbsId <message id>\`\r\n**Example**: \`${prefix}thumbsId 908754329078563212\`\r\n**Requirements**: Must be the message sender or have the _Manage messages_ permission.`,inline:true},
{name:"`vote`",value:`This will make a new vote so people can upvote or downvote your message. You can create a channel named _votes_, and all votes will be sent there. Othervise, the vote will be sent in the current channel.\r\n**Usage**: \`${prefix}vote <your message>\`\r\n**Example**: \`${prefix}vote Should i add the bot to the server?\`\r\n**Requirements**: Must have the _Vote maker_ role.`,inline:true},
{name:"`poll`",value:`It will make a new poll, with up to 10 options. You can create a channel named _polls_, and all polls will be posted there. Othervise, it will be posted in the current channel.\r\n**Usage**: \`${prefix}poll <"question"> <"option 1"> ["option 2"] ["option 3"]\`\r\n**Example**: \`${prefix}poll "What is your favorite color?" "Red" "Yellow" "Green" "Blue" "Purple"\`\r\n**Example 2**: \`${prefix}poll "What is your favorite color?"Red"Yellow"Green"Blue"Purple"\`\r\n**Requirements**: Must have the _Poll maker_ role.`,inline:true},
{name:"`invite`",value:`The bot will send some invite links\r\n**Usage**: \`${prefix}invite\`\r\n`,inline:true},
{name:"`support`",value:`Will send the support information such as the support server invite link and bot creator's username\r\n**Usage**: \`${prefix}support\`\r\n`,inline:true},
{name:"`thumbsAll`",value:`This will but a thumbsup :thumbsup: and a thumbsdown :thumbsdown: reactions to all messages in the current channel.\r\n**Usage**: \`${prefix}thumbsAll\`\r\n**Requirements**: Must have the _Manage messages_ permission.`,inline:true},
{name:"`purge`",value:`Using this command, you can delete up to 99 messages in the current channel.\r\n**Usage**: \`${prefix}purge <number 1-99>\`\r\n**Example**: \`${prefix}purge 20\`\r\n**Requirements**: Must have the _Manage messages_ permission.`,inline:true},
{name:"`togglePing` (in short: \`togg\`)",value:`You can toggle pings (mentions) with this command.\r\n**Usage**: \`${prefix}togglePing <poll|vote>\`\r\n**Example**: \`${prefix}togg p\` (This will toggle the poll ping)`,inline:true}
);
message.channel.send(`||${message.author}||`,embed);
}
if(command.toLowerCase().startsWith("thumbs ")){message.react("👍");message.react("👎");}
if(command.toLowerCase().startsWith("thumbsid ")){if(args[1]){
var msg=await message.channel.messages.fetch(args[1]);
if(msg){
if(msg.author==message.author||message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){msg.react("👍");msg.react("👎");}else{
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Insufficient permissions | :x:`).setDescription(`You cannot do this to that message. The message must be sent by you or you must have the _Manage messages_ permission.`);
message.channel.send(`||${message.author}||`,embed);}
}else{var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Invalid message ID | :x:`).setDescription(`Please provide a valid message ID (must be in the same channel).`);message.channel.send(`||${message.author}||`,embed);}
}else{var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Invalid usage | :x:`).setDescription(`Please provide a message ID (must be in the same channel) in order to use this command.`);message.channel.send(`||${message.author}||`,embed);
}}
if(command.toLowerCase().startsWith("thumbsall")){
if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
message.react("✅");
await message.channel.messages.fetch().then(async messages=>{await messages.forEach(m=>{m.react("👍");m.react("👎");});});
}else{var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Insufficient permissions | :x:`).setDescription(`You cannot do this because you don't have the _Manage messages_ permission.`);message.channel.send(`||${message.author}||`,embed);}}

if(command.toLowerCase().startsWith("purge ")){
if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
if(args[1]){
message.delete();
var amount=parseInt(args[1]);
var author=message.author;
var channel=message.channel;
if(amount>=1&&amount<100){
message.channel.bulkDelete(amount,true).then(()=>{var embed=new Discord.MessageEmbed().setColor("#00aa00").setTitle(`Purged | :white_check_mark:`);channel.send(`||${author}||`,embed);});
}else{
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Invalid usage | :x:`).setDescription(`Please specify a number between 1 and 99.`);message.channel.send(`||${message.author}||`,embed);
}
}else{var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Invalid usage | :x:`).setDescription(`Please specify the amount of messages to delete.\r\nExample: \`${prefix}purge 20\``);message.channel.send(`||${message.author}||`,embed);}
}else{var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Insufficient permissions | :x:`).setDescription(`You must have the _Manage channels_ permission in order to use this command.`);message.channel.send(`||${message.author}||`,embed);}
}

if(command.toLowerCase().startsWith("vote ")){
var pingRole=message.guild.roles.cache.find(role=>role.name==="Vote ping");
var makerRole=message.guild.roles.cache.find(role=>role.name==="Vote maker");
var link;
if(!pingRole||!makerRole){var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Role(s) not found | :x:`).setDescription(`The server should have roles named \`Vote ping\` and \`Vote maker\`.`);message.channel.send(`||${message.author}||`,embed);return;}
if(!message.member.roles.cache.has(makerRole.id)){
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Insufficient permissions | :x:`).setDescription(`You can't use this command since you don't have \`Vote maker\` (${makerRole}) role.`);message.channel.send(`||${message.author}||`,embed);
return;}
var channel=await message.guild.channels.cache.find(ch=>ch.name==="votes");
var embed=new Discord.MessageEmbed().setColor("#0088ff").setTitle(command.substring(5,command.length)).setFooter(`Vote posted by ${message.author.tag}`);
if(channel){channel.send(`||${pingRole}||`,embed).then(m=>{m.react("👍");m.react("👎");link=`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`;var embed2=new Discord.MessageEmbed().setColor("#00aa00").setTitle(`Vote posted | ✅`).setDescription(`:mag_right: [Link](${link})\r\n:mens: Author: ${message.author}`);
if(message.channel.name!=="votes")message.channel.send(`||${message.author}||`,embed2);});}else{message.channel.send(`||${pingRole}||`,embed).then(m=>{m.react("👍");m.react("👎");});}
}

if(command.toLowerCase().startsWith(`:eval `)){
if(_owners.includes(message.author.id.toString())){
try{var result=await eval(message.content.substring(prefix.length+6,message.content.length));
var obj=result;
if(typeof result=="object"&&result!=null){
obj=Object.keys(obj).map((key)=>[String(key),obj[key]]);var cache=[];var msg=JSON.stringify(obj,(key,value)=>{if(typeof value=='object'&&value!=null){if(cache.includes(value))return;cache.push(value);}return value;});cache=null;}else{if(typeof obj!="number"&&typeof obj!="string"&&typeof obj!="boolean"){obj=typeof obj}else{obj=obj.toString();}}
await fs.writeFileSync('./res.txt',JSON.stringify(obj));
await fs.writeFileSync('./res.html',`<script>\r\nvar a=${JSON.stringify(obj)};\r\nvar b=Object.fromEntries(a);\r\nconsole.log(b);\r\n</script>`);
var att=new Discord.MessageAttachment('./res.txt','result.txt');
var att2=new Discord.MessageAttachment('./res.html','result.html');
message.reply(`eval result:`,(att));
if(typeof result=='object'&&result!=null){message.reply(`eval result (html):`,(att2));}
}catch(e){message.reply(`eval error: ${e.toString()}`);}
}}

if(command.toLowerCase().startsWith("poll ")){
var pingRole=message.guild.roles.cache.find(role=>role.name==="Poll ping");
var makerRole=message.guild.roles.cache.find(role=>role.name==="Poll maker");
var link;
if(!pingRole||!makerRole){var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Role(s) not found | :x:`).setDescription(`The server should have roles named \`Poll ping\` and \`Poll maker\`.`);message.channel.send(`||${message.author}||`,embed);return;}
if(!message.member.roles.cache.has(makerRole.id)){
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Insufficient permissions | :x:`).setDescription(`You can't use this command since you don't have \`Poll maker\` (${makerRole}) role.`);message.channel.send(`||${message.author}||`,embed);
return;}
var channel=await message.guild.channels.cache.find(ch=>ch.name==="polls");

var args2=command.split("\"");args2=args2.filter(el=>{return el!=null&&el!=''&&el!=' ';});args2.shift();
var question=args2[0];
args2.shift();

var embed=new Discord.MessageEmbed().setColor("#0088ff").setTitle(question).setFooter(`Poll posted by ${message.author.tag}`);
var count=0;
var numbers=["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
args2.forEach(option=>{count++;if(count<=10){embed.addField(`${numbers[count-1]} ${option}`,"\u200B",true);}});
if(channel){channel.send(`||${pingRole}||`,embed).then(m=>{for(i=0;i<count;i++){m.react(numbers[i]);}link=`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`;var embed2=new Discord.MessageEmbed().setColor("#00aa00").setTitle(`Poll posted | ✅`).setDescription(`:question: Question: ${question}\r\n:mag_right: [Link](${link})\r\n:mens: Author: ${message.author}`);
if(message.channel.name!=="polls")message.channel.send(`||${message.author}||`,embed2);});}else{message.channel.send(`||${pingRole}||`,embed).then(m=>{for(i=0;i<count;i++){m.react(numbers[i]);}});}
}

if(command.toLowerCase().startsWith("supp")){
var embed=new Discord.MessageEmbed()
.setColor("#0077dd")
.setTitle("Support | :passport_control:")
.setFooter("Support | Opinion")
.addFields(
{name:"Discord support server",value:`[Discord server](https://discord.gg/VpBAM9DHCx)`,inline:true},
{name:"Contact the creator",value:`\`KimPlayz4LK#3433\``,inline:true}
);
message.channel.send(`||${message.author}||`,embed);
}

if(command.toLowerCase().startsWith("inv")){
var embed=new Discord.MessageEmbed()
.setColor("#0077dd")
.setTitle("Invite | :envelope:")
.addFields(
{name:"Invite the bot using the link below:",value:`[Invite link](https://discord.com/oauth2/authorize?client_id=864258901808381963&permissions=2953194616&scope=bot)`,inline:true}
);
message.channel.send(`||${message.author}||`,embed);
}

if(command.toLowerCase().startsWith("togg")){
var pollPing=message.guild.roles.cache.find(role=>role.name==="Poll ping");
var votePing=message.guild.roles.cache.find(role=>role.name==="Vote ping");

if(!pollPing||!votePing){
var desc=`The server should have role(s) named`;
if(!pp)desc=desc+" `Poll ping`";
if(!vp)desc=desc+" `Vote ping`";
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Role(s) not found | :x:`).setDescription(desc+".");
message.channel.send(`||${message.author}||`,embed);
return;}

if(args[1]){
var member=await message.guild.members.cache.get(message.author.id);
if(args[1].startsWith("p")){
if(member.roles.cache.some(r=>r.name==="Poll ping")){
member.roles.remove(pollPing);
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Poll ping off`).setDescription(`You will no longer receive new poll pings. (${pollPing})`);
message.channel.send(`||${message.author}||`,embed);
}else{
message.member.roles.add(pollPing);
var embed=new Discord.MessageEmbed().setColor("#00aa00").setTitle(`Poll ping on`).setDescription(`You will now receive new poll pings. (${pollPing})`);
message.channel.send(`||${message.author}||`,embed);}}

if(args[1].startsWith("v")){
if(member.roles.cache.some(r=>r.name==="Vote ping")){
member.roles.remove(votePing);
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Vote ping off`).setDescription(`You will no longer receive new vote pings. (${votePing})`);
message.channel.send(`||${message.author}||`,embed);
}else{
message.member.roles.add(votePing);
var embed=new Discord.MessageEmbed().setColor("#00aa00").setTitle(`Vote ping on`).setDescription(`You will now receive new vote pings. (${votePing})`);
message.channel.send(`||${message.author}||`,embed);}}
}else{
var embed=new Discord.MessageEmbed().setColor("#aa0000").setTitle(`Invalid usage | :x:`).setDescription(`Please specify the correct ping name.\r\n\`vote\` to toggle vote pings, \`poll\` to toggle poll pings.\r\n**Example**: \`${prefix}togglePing poll\``);
message.channel.send(`||${message.author}||`,embed);
}}

}});
client.on("messageReactionAdd",async(reaction,user)=>{
if(reaction.partial){try{await reaction.fetch();}catch(error){return;}}
if(reaction.message.author.id==client.user.id){
if(reaction.message.embeds[0].footer.text.startsWith(`Vote posted by `)){
if(reaction._emoji.name=="👍"&&!user.bot){reaction.message.reactions.cache.find(r=>r._emoji.name==="👎").users.remove(user.id);}
if(reaction._emoji.name=="👎"&&!user.bot){reaction.message.reactions.cache.find(r=>r._emoji.name==="👍").users.remove(user.id);}
var upvotes=reaction.message.reactions.cache.find(r=>r._emoji.name==="👍").count;
var downvotes=reaction.message.reactions.cache.find(r=>r._emoji.name==="👎").count;
var embed=new Discord.MessageEmbed().setTitle(reaction.message.embeds[0].title).setFooter(reaction.message.embeds[0].footer.text);
var edit=true;
if(upvotes==downvotes){embed.setColor("#0088ff");}if(upvotes<downvotes){embed.setColor("#aa0000");}if(upvotes>downvotes){embed.setColor("#00aa00");}
if(reaction.message.embeds[0].color==embed.color){edit=false;}
if(edit){reaction.message.edit(reaction.message.content,embed);}
}
}});
client.on("messageReactionRemove",async(reaction,user)=>{
if(reaction.partial){try{await reaction.fetch();}catch(error){return;}}
if(reaction.message.author.id==client.user.id&&user.bot==false){
if(reaction.message.embeds[0].footer.text.startsWith(`Vote posted by `)){
var upvotes=reaction.message.reactions.cache.find(r=>r._emoji.name==="👍").count;
var downvotes=reaction.message.reactions.cache.find(r=>r._emoji.name==="👎").count;
var embed=new Discord.MessageEmbed().setTitle(reaction.message.embeds[0].title).setFooter(reaction.message.embeds[0].footer.text);
var edit=true;
if(upvotes==downvotes){embed.setColor("#0088ff");}if(upvotes<downvotes){embed.setColor("#aa0000");}if(upvotes>downvotes){embed.setColor("#00aa00");}
if(reaction.message.embeds[0].color==embed.color){edit=false;}
if(edit){reaction.message.edit(reaction.message.content,embed);}
}
}});
client.on("guildCreate",async(guild)=>{
var owner=await client.users.fetch(guild.ownerID.toString());
var embed=new Discord.MessageEmbed()
.setColor('#0ba9d9')
.setTitle(":inbox_tray: | I've joined a server")
.setDescription("Someone invited me to a server")
.addField("Server name",guild.name)
.addField("Server member count",guild.memberCount)
.addField("Server owner",`\`${owner.username}#${owner.discriminator}\``)
.addField("Server owner ID",owner.id)
.addField("Server ID",guild.id)
.addField("Server region",guild.region);
_owners.forEach(async owner=>{var user=await client.users.fetch(owner);user.send(embed);});
});
client.on("guildDelete",async(guild)=>{
var owner=await client.users.fetch(guild.ownerID.toString());
var embed=new Discord.MessageEmbed()
.setColor('#0ba9d9')
.setTitle(":outbox_tray: | I've leaved a server")
.setDescription("Someone removed me from a server")
.addField("Server name",guild.name)
.addField("Server member count",guild.memberCount)
.addField("Server owner",`\`${owner.username}#${owner.discriminator}\``)
.addField("Server owner ID",owner.id)
.addField("Server ID",guild.id)
.addField("Server region",guild.region);
_owners.forEach(async owner=>{var user=await client.users.fetch(owner);user.send(embed);});
});

client.login(process.env.token);
