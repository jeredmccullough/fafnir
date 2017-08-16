# Mystique

Mystique's design, based on the [Hugo](https://gohugo.io/) framework, incorporates a [Webpack](https://webpack.js.org/) build process to enable scripting with ES6.

## Getting Started

* clone [repo](git@github.com:mathiasarmstrong/mystique.git)
* If you plan to work on Mystique please Fork the Repo and clone your personal fork. the Ampush/mystique repo should have the master, development, sandbox and prose branches. ***We will remove any other branches on the master fork***

### Prerequisites
* install Node > v7.0.0
* install Hugo > v0.19


```
brew install hugo
brew install node
```

### Installing`

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## How to Create a New Template

```
scripts/create.sh template <partner name> <template name>
```

## How to Create a New Variant

```
scripts/create.sh variant <partner name> <template name> <variant name>

## Extra Notes

In order to use placeholder images with bLazy, you must use one of the following techniques:

```
<div class="hero b-lazy"
	style="{{  echoParam $placeholders $hero.hero_mobile | printf "background-image:url(%q)" | safeCSS }}" data-src="{{ $hero.hero_mobile | absURL }}"></div>
```

or

```
<img class="wherever-you-listen__device-img b-lazy"
		src="{{  echoParam $placeholders $wherever_you_listen.devices_image | safeURL }}"
		data-src="{{ $wherever_you_listen.devices_image | absURL }}"
		alt="Mobile Devices">
```

## Authors
***Jered McCullough** - *Initial work* - [Mathiasarmstrong](https://github.com/mathiasarmstrong)

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
