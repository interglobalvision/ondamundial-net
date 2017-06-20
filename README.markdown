ondamundial-net
---
v 0.0.0

Custom theme for Onda Mundial

`git clone git@github.com:interglobalvision/ondamundial-net.git`

Tech this uses [thnx]:

- http://gulpjs.com/
- https://getcomposer.org/
- https://bower.io/
- https://github.com/WebDevStudios/CMB2
- https://github.com/fightbulc/moment.php
- https://github.com/aFarkas/lazysizes

---

#### Dev Setup

- `npm install` or `yarn`
- check composer.json if you want moment or other things
- `composer install`
- check bower.json if you want to add more than just lazysizes
- `bower install`
- `gulp build` or `gulp`

#### Notes

- When you install bower packages make sure to `--save` into the `bower.json` otherwise the gulpfile will fail to find and import correctly into the libraries
