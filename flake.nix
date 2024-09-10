{
  description = "Brochure site for Source Allies Factorio server";

  inputs = {
    dream2nix.url = "github:nix-community/dream2nix";
    nixpkgs.follows = "dream2nix/nixpkgs";

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {self, dream2nix, nixpkgs, flake-utils}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        name = "sourcetorio-site";
        src = ./.;
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = derivation {
          inherit system name src;
          builder = with pkgs; "${bash}/bin/bash";
          args = [ "-c" "echo foo > $out" ];
        };
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            pnpm
          ];
        };
      }
    );
}

    # packages =  (system: {
    #   sourcetorio-site = dream2nix.lib.evalModules {
    #     packageSets.nixpkgs = nixpkgs.legacyPackages.${system};
    #     modules = [
    #       ./sourcetorio-site.nix
    #       {
    #         paths.projectRoot = ./.;
    #         paths.projectRootFile = "flake.nix";
    #         paths.package = ./.;
    #       }
    #     ];
    #   };
    #   default = self.packages.${system}.sourcetorio-site;
    # });
