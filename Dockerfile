FROM node:0.10-onbuild

EXPOSE  3000
CMD ["node", "/code/src/bin/www"]