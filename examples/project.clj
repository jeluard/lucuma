(defproject lucuma-examples "0.2.0-SNAPSHOT"
  :dependencies [[org.clojure/clojurescript "0.0-1978"]
                 [lucuma "0.2.0-SNAPSHOT"]
                 [prismatic/dommy "0.1.2"]
                 [garden "1.1.3"]]
  :plugins [[lein-cljsbuild "0.3.4"]
            [com.cemerick/clojurescript.test "0.1.0"]]
  :cljsbuild {:builds [{:source-paths ["src" "test"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :optimizations :advanced
                                   :pretty-print false}}
                       {:id "dev"
                        :source-paths ["src" "test"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :source-map true
                                   :optimizations :none}}]
              :test-commands {"slimerjs" ["slimerjs" :runner "target/cljs/lucuma+examples.js"]}}
  :aliases {"clean-test" ["do" "clean," "cljsbuild" "clean," "cljsbuild" "test"]
            "clean-build" ["do" "clean," "cljsbuild" "clean," "cljsbuild" "once"]
            "clean-dev"  ["do" "clean," "cljsbuild" "clean," "cljsbuild" "auto" "dev"]}
  :min-lein-version "2.3.0"
  :repositories  {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"})
