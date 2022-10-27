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
You can now also create your own tags in a seperate file (ending in .json) and then import them by creating a new item in the tags property.
That item would look something like "mytags.json" or "tags/mytags.json"

If you want to create your own tags you will have to now how they are structured.
You can understand the logic if you want to really know what everything does (the bin/processFile/translator.js contains the class which I use), but I'll also explain it right here.
Every tags is alike this object: { from, to, hasArguments, addOpenBracketAtEnd, addSemicolonAtEnd, useParenthesesForArguments }
Here is a list of what each property does

-   from: the from property can be "foreach" for example. The program will automaticly add an @ symabal at the start, so you don't need to think of that
-   to: By default this is set to the from property, but if you have a tag which changes in php relative to the tag then you can use this property
-   hasArguments: This tells the program if it should add any arguments passed to the tag to the output. By default this is set to true
-   addOpenBracketAtEnd: A foreach loop in php looks like this: "foreach($items as $item) {"
    It has an open bracket at the end.
    Some tags don't need this, but by default this property is set to true
-   useParenthesesForArguments: Some php functions do not use parentheses for their arguments. An example of this would be 'echo' or 'namespace'. Therefor you can also disable this, but by default it is set to true
-   addSemicolonAtEnd: This tell the program if it should add a ; character at the end. This is usually done in single line functions and stuff alike, but for example a foreach loop has a { character at the end and a semicolon would not be wanted. By default this behaviour is set to false

The from property is like "foreach". The program will automaticly add a @ symbol at the start, so you don't need to think of that.
By default the to property is the same as the from property, the hasArguments property is set to true (this will add any arguments passed to the tag)

## current issues

### 1

Because the tags and the inline xphp are handled seperatly the following example:

    @foreach({{$items}} as $item)

will output

    <?php foreach(<?=$items?> as $item){ ?>

Luckily this (usually) isn't a problem because most people don't use inline xphp inside of a tag.

## contributing

Thank you for considering contributing to this project.
At the moment I don't really have that much rules for when you want to contibute, but please be clear about what your code does and if you've solved an issue please also tell me which issue.
