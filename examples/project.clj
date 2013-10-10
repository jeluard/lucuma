(defproject lucuma-examples "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojurescript "0.0-1913"]
                 [lucuma "0.1.0-SNAPSHOT"]
                 [prismatic/dommy "0.1.2-SNAPSHOT"]
                 [garden "1.0.0"]]
  :plugins [[lein-cljsbuild "0.3.3"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src"]
                        :compiler {:output-dir "target/cljs"
                                   :output-to "lucuma+examples.js"
                                   :source-map "lucuma+examples.js.map"
                                   :optimizations :simple
                                   :pretty-print true}}
                       {:id "production"
                        :source-paths ["src"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :optimizations :advanced
                                   :pretty-print false}}]}
  :min-lein-version "2.3.0"
  :repositories  {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"})
