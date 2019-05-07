#!/bin/sh
EDGAR_EXPLORER_DIR_DEFAULT=~/work/edgar-explorer/
EDGAR_EXPLORER_DIR="${EDGAR_EXPLORER_DIR:-$EDGAR_EXPLORER_DIR_DEFAULT}"

cd $EDGAR_EXPLORER_DIR

tmux rename-window business
tmux split-window -v
tmux send-keys 'tig' 'C-m'
tmux select-pane -t 0

cd $EDGAR_EXPLORER_DIR/packages/ctx-core

tmux new-window
tmux rename-window ctx-core
tmux split-window -v
tmux send-keys 'tig' 'C-m'
tmux select-pane -t 0

cd $EDGAR_EXPLORER_DIR

tmux new-window
tmux rename-window util
tmux split-window -v
tmux split-window -v
tmux select-layout even-vertical
tmux select-pane -t 0

cd $EDGAR_EXPLORER_DIR/packages/web

tmux new-window
tmux rename-window web
tmux split-window -v
tmux send-keys 'yarn run dev' 'C-m'
tmux select-layout even-vertical
tmux select-pane -t 0

tmux select-window -t 0
