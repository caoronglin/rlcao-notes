#!/usr/bin/env bash
set -u
cd "/media/rlcao/Data/data/05-个人项目/rlcao/notes/生信实验/03" || exit 1
bash scripts/task1_blastn.sh
bash scripts/task2_blastp.sh
bash scripts/task3_4.sh
echo "ALL_TASKS_DONE"
