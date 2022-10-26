# XPHP Command Line Tool

Xphp stands for extended PHP (or extended hypertext preprocessor)
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

## current issues

### 1

Because the tags and the inline xphp are handled seperatly the following example:

    {{ @foreach($items as $item) }}
    @foreach({{$items}} as $item)

will output

    <?= <?php foreach($items as $item){ ?> ?>
    <?php foreach(<?=$items?> as $item){ ?>

## contributing

Thank you for considering contributing to this project.
At the moment I don't really have that much rules for when you want to contibute, but please be clear about what your code does and if you've solved an issue please also tell me which issue.
