target=$1
rsync -avz --delete build/* $target
