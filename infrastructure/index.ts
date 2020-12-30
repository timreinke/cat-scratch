import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as fs from 'fs'
import { CustomResource, CustomResourceOptions } from "@pulumi/pulumi";

const key = new digitalocean.SshKey("default", {publicKey: fs.readFileSync("/home/tim/.ssh/id_rsa.pub").toString()});

const privateWeb = new digitalocean.Tag("private-web", {});
const publicSsh = new digitalocean.Tag("public-ssh", {});
const publicWeb = new digitalocean.Tag("public-web", {});

//const tiac = new digitalocean.Domain("tiac", {name: "thisisacomputer.com"}, {
//  protect: true,
//});

// Create a new Web Droplet in the nyc2 region
export const web = new digitalocean.Droplet("web", {
    name: "machine-starter-demo",
    image: "ubuntu-20-04-x64",
    region: "nyc3",
    size: "s-1vcpu-1gb",
    tags: ["private-web"],
    sshKeys: [key.fingerprint],
    userData: fs.readFileSync('provisioning/digitalocean_init.yaml').toString()
});

class Me extends CustomResource {
  constructor(name : string, props : Record<string, any>, opts?: CustomResourceOptions) {
    super("me", name, props, opts)
  }
}

export const foo = new Me('woot', {})

const privateWebFirewall = new digitalocean.Firewall("privateWebFirewall", {
  tags: [privateWeb.name],
  inboundRules: [
  ],
  outboundRules: [
      {
          protocol: "tcp",
          portRange: "1-65535",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
      {
          protocol: "udp",
          portRange: "1-65535",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
      {
          protocol: "icmp",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
  ],
});

const publicSshFirewall = new digitalocean.Firewall("publicSshFirewall", {
  tags: [publicSsh.name],
  inboundRules: [
      {
          protocol: "tcp",
          portRange: "22",
          sourceAddresses: [
              "0.0.0.0/0",
          ]
      },
  ],
  outboundRules: [
      {
          protocol: "tcp",
          portRange: "1-65535",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
      {
          protocol: "udp",
          portRange: "1-65535",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
      {
          protocol: "icmp",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
  ],
});

const publicWebFirewall = new digitalocean.Firewall("publicWeb", {
  tags: [publicWeb.name],
  inboundRules: [
      {
          protocol: "tcp",
          portRange: "80",
          sourceAddresses: [
            "0.0.0.0/0",
          ],
      },
      {
          protocol: "tcp",
          portRange: "443",
          sourceAddresses: [
            "0.0.0.0/0",
          ],
      },
  ],
  outboundRules: [
      {
          protocol: "tcp",
          portRange: "1-65535",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
      {
          protocol: "udp",
          portRange: "1-65535",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
      {
          protocol: "icmp",
          destinationAddresses: [
              "0.0.0.0/0",
              "::/0",
          ],
      },
  ],
});




const www = new digitalocean.DnsRecord("app", {
  domain: "thisisacomputer.com",
  type: "A",
  value: web.ipv4Address,
  name: "app",
  ttl: 40
});

