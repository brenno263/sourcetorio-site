pnpm i
pnpm build
rsync --recursive --delete --chmod=ugo=rX ./dist/ github@factorio.qrimby.com:/var/www/sourcetorio-site