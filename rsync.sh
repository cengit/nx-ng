#!/bin/bash -e

host=$1
www_folder=$2

if [ -z "$SSH_PRIVATE_KEY" ]; then
  >&2 echo "请到 项目 > Settings > CI/CD > Secret variables 设置 SSH_PRIVATE_KEY"
  exit 1
fi


mkdir "${HOME}/.ssh"
keyfile="${HOME}/.ssh/id_rsa"
echo "${SSH_PRIVATE_KEY}" > $keyfile
chmod 600 $keyfile
printf "StrictHostKeyChecking no\n" > "${HOME}/.ssh/config"
chmod 700 "${HOME}/.ssh/config"

rsync -avzm -e 'ssh -p 37500 -o UserKnownHostsFile=/dev/null -o LogLevel=quiet -o StrictHostKeyChecking=no' --include "*/" --include="*.html" --exclude="*"  dist/* front@$host:$www_folder

if [ -d "dist/apps/auth/" ];then
  rsync -avzm -e 'ssh -p 37500 -o UserKnownHostsFile=/dev/null -o LogLevel=quiet -o StrictHostKeyChecking=no' dist/apps/auth/auth.html front@$host:$www_folder
fi
