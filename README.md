This project provides some structure and patterns for using io-ts, xstate, immer, and React in
a single-node multiuser application. State-preserving live-reload is setup and there are
some utilities for generating and editing parts of the project. There are APIs for building editor
components, operating on the source, that provide a more structured editing experience than free-form.
It comes with basic deployment scripts that set up single node deployments in Digital Ocean, AWS, and others.

See the [project homepage](https://thisisacomputer.com/lab/projects/cat-scratch/) for more information.


# TODO
- Boot and document processes
 - code-server
 - dev-server

- Document setup
```
pulumi login
pulumi --cwd infrastructure stack select
pulumi plugin install resource digitalocean v3.2.0
pulumi config set ...
```

- actually have some app functionality of some sort

- thinking about deployment lifecycle
- maybe add https://github.com/replit/upm

## TODO someday
- investigate oauth2-proxy vs loginsrv
 