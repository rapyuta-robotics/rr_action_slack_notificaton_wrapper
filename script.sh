#!/bin/bash
set -e
IFS=$'\n'
lines=($(echo $REPL))
tmp=$(cat $1)
for l in "${lines[@]}"
do
    echo $l
    echo "*************************"
    key=$(echo $l | sed -e "s/\(.\+\)=\".\+\"/\1/g")
    val=$(echo $l | sed -e "s/.\+=\"\(.\+\)\"/\1/g")
    tmp=$(sed -e "s~%$key~$val~g" <<< $tmp) || echo "Failed replacement for $l"
done
echo "$tmp" > $1.fixed