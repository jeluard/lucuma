(defproject lucuma "0.2.1-SNAPSHOT"
  :description "A Web Components library for ClojureScript"
  :url "https://github.com/jeluard/lucuma"
  :license  {:name "Eclipse Public License"
             :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths  ["src" "test"]
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2311"]]
  :plugins [[lein-cljsbuild "1.0.3"]
            [com.cemerick/clojurescript.test "0.3.1"]]
  :cljsbuild {:builds [{:source-paths ["src" "test"]
                        :compiler {:output-to "target/cljs/lucuma.js"
                                   :optimizations :simple}}]
              :test-commands {; Disabled for now: based on too old webkit version.
                              ; "phantomjs" ["phantomjs" :runner "dev-resources/document-register-element-0.0.8.js" "target/cljs/lucuma.js"]
                              ; TODO Add support for http://triflejs.org/
                              ; SlimerJS doesn't support exit code so CI won't fail when tests fail. See https://github.com/laurentj/slimerjs/issues/50.
                              "slimerjs" ["slimerjs" :runner "bower_components/polymer-platform/platform.js" "target/cljs/lucuma.js"]}}
  :aliases {"clean-test" ["do" "clean," "cljsbuild" "clean," "cljsbuild" "test"]
            "clean-install" ["do" "clean," "cljsbuild" "clean," "install"]}
  :min-lein-version "2.4.3")
