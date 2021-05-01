![](https://lehtodigital.fi/f/npumv)

**Shorthand is a lightweight jQuery-like DOM manipulation library.**
The main purpose of Shorthand is to give the developer an easy and familiar way
to access and modify DOM content, without unnecessary bloat.
It is very powerful when full-flexed UI libraries are too much
and good old jQuery isn't an option.

## Documentation and list of implemented features
A link to the documentation can be found below.
The documentation is the best and only complete list of the implemented features.
If you wanted to e.g. migrate from jQuery, the documentation is your best friend.

**Documentation:**
- JSDoc: https://lehtoroni.github.io/shorthand/
- You can also [see the source](./src/shorthand.js)

#### ⚠️ Disclaimer
This library is in a highly developmental stage.
I wouldn't recommend using it in a production environment.

## Compatibility with jQuery
Shorthand is **not** a drop-in jQuery replacement.
It uses the `$H` handle for its operations, and doesn't support all of
jQuery's features or handle everything in the same way.
The feature list of Shorthand is fairly short,
but in the right hands it is surprisingly powerful.

Shorthand is written in an ES6-ish fashion.
If you need support for older browsers, some transpiling has to be done.
I might even provide some pre-transpiled files later on.

Currently, Shorthand doesn't support jQuery's "next", "previous" etc. functions.
If a value is being queried and the ShorthandArray contains multiple elements,
the value will be returned from the first one.

**TL;DR:** Doesn't work straight out of the box on old browsers and
isn't a drop-in jQuery replacement. Some things work just like with
jQuery, some don't. Please see the documentation!


## Downloading and using $horthand
If you want to use Shorthand in production, please see if there is anything
on the [releases](https://github.com/lehtoroni/shorthand/releases) page.
Releases may not be created regularly, so, if the releases page is out of date,
you could just download the repository and use the `shorthand.js` file.

For the time being, there are no modules or imports.
The `shorthand.js` file gives you exactly what you need: the library,
ready to be used, compatible with most (modern) browsers.


## A brief introduction

### Creating and querying elements
You can use Shorthand to query existing elements with standard CSS queries.
```js
// <div id="my-div"></div>
$H('#my-div')

// <span class="my-text"/> <span class="my-text"/> <span class="my-text"/>
$H('.my-text')

// <p><b data-element="1">Hello world</b></p>
$H('p b[data-element="1"]')
```

You can also use Shorthand to create new elements, just like with jQuery.
```js
const $parsed = $H('<div><span/><b/></div>');
$H('#another-div').append($parsed);
```

#### ⚠️ Caution!
Shorthand uses vanilla JS methods to parse HTML strings into document nodes.
It does not provide any jQuery-like error correction.

### Element manipulation

#### HTML and text content
Just like with jQuery, `.text()` and `.html()` can be used to get and set the
text and html contents of any queried elements.
```js
// Use $H().text() and $H().html() to query text and html contents:
const paragraphText = $H('p.my-text').text();
const divHtml = $H('#footer').html();

// Use $H().text(value) and $H().html(value) to set text and html contents:
$H('p.my-text').text('cats > dogs');
$H('#footer').html('<b>There is nothing here.</b>');
```

Appending is also possible. The `.append(...)` function supports appending
Shorthand objects, strings (html and text nodes) and plain DOM element objects. 
```js
// Use $H().append(...) to append any amount of parsed elements to another element
$H('body').append(
    $H('<h1/>').text('Why cats > dogs?'),
    $H('<p/>').text('Simple reason: because they are'),
    '(Side note: this is also possible!)'
)
$H('body p').append('...just better!');
```

#### Inline styles
There is a `.css()` function. It mostly works just like jQuery, except that
**relative values are not supported**.
```js
// Use $H().css(key) to query inline css values:
const textColor = $H('.fancy-text').css('color');

// Use $H().css(key, value) to set inline css values:
$H('.fancy-text').css('color', '#ff00ff').css('text-decoration', 'underline');

// You can also use an object to pass multiple key-value-pairs:
$H('.fancy-text').css({
    'color': 'green',
    'font-family': 'sans-serif'
});
```

#### Attributes, classes and visibility
Use the `.attr()` function. It mostly works just like with jQuery.
```js
// Use .attr(key) to query attributes
const inputName = $H('#my-input').attr('name');

// Use .attr(key, value) to set attributes
const $img = $H('<img class="cat"/>').attr('src', 'cat.gif');
$H('#dog').html('').append($img);

// Use an empty value or null to remove attributes
$H('#dog img.cat').attr('src', '');
```

To modify classes, use `.addClass()`, `.removeClass()` and `.toggleClass()`.
Functions `addClass` and `removeClass` can take as many arguments as you want.
The `toggleClass` function can be used to toggle a class on or off (add or remove
it depending on if the elements already have it or not).
```js
// Use the `.addClass()` function to add one or more classes
const $inp = $H('<input type="text" name="username"/>').addClass('form-control');
$H('body').append($inp);

// Add the '.is-invalid' class and remove it after a while
$inp.toggleClass('is-invalid');
setTimeout(() => $inp.removeClass('is-invalid'), 5000);
```

You can use `.show()` and `.hide()` to control the visibility of elements:
```js
// Hide elements with class 'secret', and show them after a while
$H('.secret').hide();
setTimeout(() => $H('.secret').show(), 5000);
```


### Event handling
**Event handling differs quite a lot from jQuery.**
None of the callback functions rely on the use of `this`.
Instead, the target element is passed as a second argument.
Also, Shorthand doesn't wrap the original event object: it passes the
fired event straight to the callback.

```js
$H('body').append($H('<button id="my-button"/>').text('Click me!'));
$H('body').append($H('<button/>').text('Click me too!'));

// Simple usage: add any event listener to any element
$H('#my-button').on('click', (e, $e) => {
    console.log('They clicked it! The button says: ' + $e.text());
});

// Target filtering: this will catch clicks on any buttons inside body
$H('body').on('click', 'button', (e, $e) => {
    console.log('A wild click appeared! The element says: ' + $e.text());
});
```

#### DOMContentLoaded shorthand
There is no `.ready()` function in Shorthand, but you can just pass a function
to `$H` to be run when the `DOMContentLoaded` is fired:

```js
$H(() => {
    console.log('The content has been loaded! Yay!');
});
```

## License
**$horthand is licensed under the MIT license**.
Feel free to adapt it into projects in any way you like.
If you are a jQuery-oriented dinosaur like me, it $horthand can get handy!

## Contributing
Currently $horthand is just a small freetime project of mine.
However, if you feel like you could give it some powerful additions that
would fit well in its philosophy, feel free to fork it and/or contact me. 
