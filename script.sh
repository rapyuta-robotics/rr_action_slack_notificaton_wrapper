#!/bin/bash

IFS=$'\n'
lines=($1)
tmp=$(cat $2)
for l in "${lines[@]}"
do
    key=$(echo $l | sed -e "s/\(.\+\)=\".\+\"/\1/g")
    val=$(echo $l | sed -e "s/.\+=\"\(.\+\)\"/\1/g")
    tmp=$(sed -e "s~%$key~$val~g" <<< $tmp)
done
echo "$tmp"