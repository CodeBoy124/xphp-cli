# XPHP Command Line Tool

Xphp stands for extended PHP (or extended hypertext preprocessor).
With xphp you can quickly make a foreach loop to show some data in a table while still making the code very readable.

## usage

First you have to install the cli with npm using "npm i --save-dev xphp-cli" (if you want it as a development dependency), "npm i -g xphp-cli" (for global installation) or just "npm i xphp-cli"

Then to use this cli you also have to write a .xphp file.
After that you can run 'xphp' in the root of your project and the cli will search for all files ending in .xphp in the directory and will create a .php file next to every .xphp file

## Versions and features

### 1.0.0

In version 1.0.0 you can use an inline php syntax based on the {{ ...some data }} syntax of VueJS.
{{ $item }} written in xphp changes into &lt;\\?= $item ?> in php.
Besides inline php there are also tags.
I don't know how I can best explain them, so I'll just show you an example of a program that displays somem data in an ul element with an @foreach tag, @end tag and some inline xphp.

    <ul>
    @foreach($items as $item)
        <li>{{ $item }}</li>
    @end
    </ul>

Besides @foreach and @end there are also some other tags. here is a list of all of the current tags

-   @foreach
-   @if
-   @elif
-   @else
-   @end

### 1.1.0

In version 1.1.0 most of the problems I noticed in the previous version (1.1.0) have been solved.
You can now run {{ $item . "}}" }} without any problems.
Also if you use a tag like @foreach inside of inline xphp it will now not replace it with <?php ... ?>
Also in this version I introduced a lot of new tags

-   @for
-   @while
-   @include / @require
-   @namespace

Please do keep in mind that for @include, @require and @namespace you still have to use parentheses.
This can be best visualized inside this example:

    @namespace(Something)
    @include("otherfile")
    ...some code

You can now also use @elseif instead of @elif if you prefer

### 1.1.1

In version 1.1.1 you can now use a config file to modify the behaviour of the cli.
There are now also more commands.
Here is a list of all the possible commands in this version:

-   xphp: Searches for xphp files in the current working directory and all it's subfolders
-   xphp init: Shows the current version of the xphp cli
-   xphp version: Creates a basic xphpconfig.json file. This is optional, but if you want to customize the behaviour you can use that file
-   xphp help: Shows a list of available commands

When you run xphp init a config file will appear in the root of your project (at least it should be there, but if you run the init command from a a different directory it will be placed in that directory).
This xphp config file has a couple things you can change.
First of all you can change what kind of xphp file the cli searches (you can now use for example a .something file extension instead of .xphp) using the xphpFileExtension property.
The things described above here are the same for the php output file. For that you just have to use the phpFileExtension file extension

Besides stuff for file extensions you can now also disable the {{...}} syntax using the useInlineXphp property if you like.

And the last thing you can customize is what tags are used.
By default the tags property contains "default" which means it uses the default tags.
<s style="color:orange">You can now also create your own tags in a seperate file (ending in .json) and then import them by creating a new item in the tags property.
That item would look something like "mytags.json" or "tags/mytags.json"</s>

<s style="color:orange">If you want to create your own tags you will have to now how they are structured.
You can understand the logic if you want to really know what everything does (the bin/processFile/translator.js contains the class which I use), but I'll also explain it right here.
Every tags is alike this object: { from, to, hasArguments, addOpenBracketAtEnd, addSemicolonAtEnd, useParenthesesForArguments }
Here is a list of what each property does</s>

-   <s style="color:orange">from: the from property can be "foreach" for example. The program will automaticly add an @ symabal at the start, so you don't need to think of that</s>
-   <s style="color:orange">to: By default this is set to the from property, but if you have a tag which changes in php relative to the tag then you can use this property</s>
-   <s style="color:orange">hasArguments: This tells the program if it should add any arguments passed to the tag to the output. By default this is set to true</s>
-   <s style="color:orange">addOpenBracketAtEnd: A foreach loop in php looks like this: "foreach($items as $item) {"
    It has an open bracket at the end.
    Some tags don't need this, but by default this property is set to true</s>
-   <s style="color:orange">useParenthesesForArguments: Some php functions do not use parentheses for their arguments. An example of this would be 'echo' or 'namespace'. Therefor you can also disable this, but by default it is set to true</s>
-   <s style="color:orange">addSemicolonAtEnd: This tell the program if it should add a ; character at the end. This is usually done in single line functions and stuff alike, but for example a foreach loop has a { character at the end and a semicolon would not be wanted. By default this behaviour is set to false</s>

<s style="color:orange">The from property is like "foreach". The program will automaticly add a @ symbol at the start, so you don't need to think of that.
By default the to property is the same as the from property, the hasArguments property is set to true (this will add any arguments passed to the tag)</s>

### 1.1.3

In version 1.1.2 I have improved how tags are created (therefor also the orange text above).
Now there are only two properties: from & to.
The from property is a string which identifies what the tag looks like in xphp. The  @foreach tag for example uses "foreach" for the from property.
The to property is a function which (optional) can take in the arguments found for the tag (as one large string).
The to function must return the actual php code that is being used in the output file.
Because the to property is a function you can no longer create the tags in a .json file, but you have to use a .js file.
Let's have a look at an example of a not yet existing random tag.

```javascript
/* randomTag.js */
module.exports = [
    {
        from: "random",
        to(args){
            return `<?= rand(${args}) ?>`;
        }
    }
];
```

If you add "randomTag.js" to the tags property of the xphpconfig.json file (so "tags": ["default", "randomTag.js"]);
And where to use @random(0, 10) in your xphp file, then it gets converted to <?= rand(0, 10) ?>

### 1.1.4

Custom components can now also get information of the position of the xphp file.
To show how you can get this information I write this example:

```javascript
module.exports = [
    {
        from: "fileinfo",
        to(args, {projectRoot, rootToFile, rootToFolderOfFile}){
            return `<?php /*project root directory: ${projectRoot}; path to current file: ${rootToFile}; path to parent folder of file: ${rootToFolderOfFile}*/ ?>`;
        }
    }
];
```

### 1.1.7

I recently discovered blade templates and altough this project is not going to be so big and focussed on 1 project I did try adding the @endforeach, @endif and so on.
You can still use @end, but if you want @endforeach (and the others) are supported.
Please keep in mind that not every directive from blade exists in xphp.

### 1.1.9

In this version you can now specify a directory to find all files and a directory to place all the output files.
To specify an input directory you can use the 'fromDir' property in the config file and set it to a folder (relative to the root of your project).
The same is true for the output directory, but you just have to use the 'toDir' property.

<u>**IMPORTANT** if you update you xphp-cli version to 1.1.9 then you'll also have to add the new properties to the config file manually (only in already existing projects)</u>

## Best VSCode syntax highlighting (for now)

There is no vscode extension for syntax highlighting xphp, but you can create a file association by clicking on the "Select Language Mode" button in the bottom. After that you can click "Configure File Association for '.xphp'..." and select "blade" (if it does not show up you can search for vscode extensions that add syntax highlighting for blade templates). That way you get the (currently) best syntax hightlighting for xphp and you also have intelisense (altough you should keep in mind not every directive is supported in xphp)

## contributing

Thank you for considering contributing to this project.
At the moment I don't really have that much rules for when you want to contibute, but please be clear about what your code does and if you've solved an issue please also tell me which issue.
