(defproject lucuma-examples "0.2.0-SNAPSHOT"
  :dependencies [[org.clojure/clojurescript "0.0-2156"]
                 [lucuma "0.2.0-SNAPSHOT"]
                 [prismatic/dommy "0.1.2"]
                 [garden "1.1.5"]]
  :plugins [[lein-cljsbuild "1.0.2"]
            [com.cemerick/clojurescript.test "0.2.2"]]
  :cljsbuild {:builds [{:id "prod"
                        :source-paths ["src" "test"]
                        :compiler {:output-to "target/cljs/lucuma+examples.js"
                                   :optimizations :simple
                                   :pretty-print false}}
                       {:id "dev"
                        :source-paths ["src" "test"]
                        :compiler {:output-to "../../lucuma-doc/assets/lucuma+examples.js"
                                   :optimizations :simple}
                        :notify-command ["terminal-notifier"
                                         "-title"
                                         "Lucuma"
                                         "-subtitle"
                                         "dev"
                                         "-group"
                                         "lucuma-build"
                                         "-activate"
                                         "com.googlecode.iTerm2"
                                         "-message"]}]
              :test-commands {"slimerjs" ["slimerjs" :runner "target/cljs/lucuma+examples.js"]}}
  :aliases {"clean-test" ["do" "clean," "cljsbuild" "clean," "cljsbuild" "test"]
            "clean-build" ["do" "clean," "cljsbuild" "clean," "cljsbuild" "once" "prod"]
            "clean-dev"  ["do" "clean," "cljsbuild" "clean," "cljsbuild" "auto" "dev"]}
  :min-lein-version "2.3.4")
