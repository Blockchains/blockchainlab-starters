#!/usr/bin/env bash
# Toolchains for every starter: Foundry, circom, Noir. Node 20 comes from the image.
set -e
git submodule update --init --recursive
curl -L https://foundry.paradigm.xyz | bash && ~/.foundry/bin/foundryup
sudo curl -sSfL -o /usr/local/bin/circom https://github.com/iden3/circom/releases/download/v2.2.3/circom-linux-amd64 && sudo chmod +x /usr/local/bin/circom
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash && ~/.nargo/bin/noirup
echo 'export PATH="$HOME/.foundry/bin:$HOME/.nargo/bin:$PATH"' >> ~/.bashrc
