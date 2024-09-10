{
  dream2nix,
  config,
  lib,
  ...
}: {
  imports = [
    dream2nix.modules.dream2nix.mkDerivation
  ];

  name = "sourcetorio-site";
  version = "0.0.1";

  deps = {nixpkgs, ...}: {
    inherit
      (nixpkgs)
      fetchFromGithub
      mkShell
      ;
  };

  mkDerivation = {
    # builder = "/bin/sh";
    # args = ["-c" "echo $name > $out"];
    src = builtins.fetchGit {
      shallow = true;
      url = "https://github.com/DavHau/cowsay";
      ref = "package-lock-v3";
      rev = "c89952cb75e3e54b8ca0033bd3499297610083c7";
    };
    # allow devshell to be built -> CI pipeline happy
    buildPhase = "mkdir $out";
  };

  # nodejs-package-lock-v3 = {
  #   packageLockFile = "${config.mkDerivation.src}/package-lock.json";
  # };
}
