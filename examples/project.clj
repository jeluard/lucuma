(defproject lucuma-examples "0.1.0-SNAPSHOT"
  :dependencies [[lucuma "0.1.0-SNAPSHOT"]
                 [prismatic/dommy "0.1.2-SNAPSHOT"]
                 [garden "1.0.0"]]
  :plugins [[lein-cljsbuild "0.3.3"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :optimizations :simple
                                   :pretty-print true}}]}
  :min-lein-version "2.3.0"
  :repositories  {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"})
