import Blazy from 'blazy';

export const bLazy = new Blazy({
	breakpoints: [
		{
			width: 475,
			src: 'data-src-small'
		},
		{
			width: 765,
			src: 'data-src-medium'
		},
		{
			width: 1024,
			src: 'data-src-large'
		},
		{
			width: 2600,
			src: 'data-src-extra-large'
		}
	]
});

window.onresize = function (event) {
	bLazy.revalidate();
};