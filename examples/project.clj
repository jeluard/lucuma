(defproject lucuma-examples "0.2.0-SNAPSHOT"
  :dependencies [[org.clojure/clojurescript "0.0-1934"]
                 [lucuma "0.2.0-SNAPSHOT"]
                 [prismatic/dommy "0.1.2"]
                 [garden "1.0.0"]]
  :plugins [[lein-cljsbuild "0.3.4"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :source-map "target/cljs/lucuma+examples.js.map"
                                   :optimizations :simple
                                   :pretty-print true}}
                       {:id "production"
                        :source-paths ["src"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :optimizations :advanced
                                   :pretty-print false}}]}
  :min-lein-version "2.3.0"
  :repositories  {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"})
