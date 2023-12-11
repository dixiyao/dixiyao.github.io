# iQua group external website

This repository contains the external website for the iQua group deployed at [iQua group](https://iqua.ece.toronto.edu).

To serve the website locally for development, [Hugo](https://gohugo.io/) needs to be installed first:

```shell
brew install hugo
```

This git repository needs to be cloned with the `--recursive` option:

```shell
git clone https://github.com/iqua/group-website --recursive
```

To build the website, run the command:

```shell
hugo
```

The built website is located in the `public/` directory. If the website has been built before, it may be a good idea to start from a clean slate before building it again:

```shell
rm -rf public
```

To serve the website with the full-site search feature enabled, [Pagefind](https://pagefind.app/) needs to be installed locally. The best option is to build from source, by first installing [Rust and Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html):

```shell
curl https://sh.rustup.rs -sSf | sh
```

To update Rust after its initial installation, run:

```shell
rustup update
```

and then install [Pagefind](https://pagefind.app/) with the extended version:

```shell
cargo install pagefind --features extended
```

Finally, to serve the website, run:

```shell
pagefind --site "public" --serve
```

and then point the web browser to `http://localhost:1414`.
