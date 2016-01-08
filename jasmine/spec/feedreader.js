/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    "use strict";

    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('have a url defined for each feed', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });

        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('have a name defined for each feed', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            });
        });
    });

    /* Write a new test suite named "The menu" */
    describe('The menu', function() {
        var $menu = $('.slide-menu');

        var menuHidden = function() {
            var menuRight = $menu.position().left + $menu.width();
            var menuBottom = $menu.position().top + $menu.height();
            return (menuRight <= 0) || (menuBottom <= 0);
        };

        /* Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden by default', function() {
            expect(menuHidden()).toBe(true);
        });

        /* Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        describe('changes visibility', function() {
            var $menuIcon = $('.header a');

            beforeEach(function(done) {
                $menuIcon.trigger('click');

                setTimeout(function() {
                    done();
                }, 250);
            });

            it('to be visible', function(done) {
                expect(menuHidden()).toBe(false);
                done();
            });

            it('to be hidden', function(done) {
                expect(menuHidden()).toBe(true);
                done();
            });
        });
    });

    /* Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        /* Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        beforeEach(function(done) {
            loadFeed(0, function() {
                done();
            });
        });

        it('have at least a single item', function(done) {
            var $feedContainer = $('.feed');
            var feedCount = $feedContainer.children().length;
            expect(feedCount).toBeGreaterThan(0);
            done();
        });
    });

    /* Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        /* Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        var $originalFeedContent, $newFeedContent;

        beforeEach(function(done) {
            loadFeed(0, function() {
                $originalFeedContent = $('.feed').html();
                loadFeed(1, done);
            });
        });

        it('changes the content in the feed container', function(done) {
            var $newFeedContent = $('.feed').html();
            expect($newFeedContent).not.toMatch($originalFeedContent);
            done();
        });
    });

    /* Regression test to ensure that 'loadFeed' sets the page header title correctly
     * This test suite loops through the allFeeds object, and loads
     * the page for each defined feed. Then for each page, the specs
     * check that the text of the title in the page header matches the
     * name of the feed defined in the allFeeds object.
     */
    describe('Page Header Title', function() {
        var feedListIndex;

        beforeAll(function() {
            feedListIndex = 0;
        });

        beforeEach(function(done) {
            loadFeed(feedListIndex, function() {
                done();
            });
        });

        afterAll(function() {
            loadFeed(0);
        });

        var headerTitleTest = function(feed) {
            it('matches name of selected feed (' + feed.name + ')', function(done) {
                var $feedName = $('.header-title').text();
                console.log('feed name: ' + $feedName);
                expect($feedName).toMatch(feed.name);
                feedListIndex++;
                done();
            });
        };

        allFeeds.forEach(function(feed) {
            headerTitleTest(feed);
        });
    });
}());
