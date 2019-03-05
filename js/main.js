jQuery(document).ready(function($) {
  function RevealingProject(element) {
    this.element = element;
    this.projectTrigger = this.element.find(".project-trigger");
    this.projectClose = this.element.find(".project-close");
    this.projectTitle = this.element.find("h1");
    this.projectMask = this.element.find(".mask");
    this.maskScaleValue = 1;
    this.bgImage = this.element.find(".featured-image");
    this.projectContent = this.element.find(".cd-project-info");
    this.projectContentUrl = this.projectContent.data("url");
    this.animating = false;
    this.scrollDown = this.element.find(".cd-scroll");
    this.scrolling = false;
    this.initProject();
  }
  RevealingProject.prototype.initProject = function() {
    var self = this;
    this.projectTrigger.on("click", function(event) {
      event.preventDefault();
      if (!self.animating) {
        self.animating = true;
        self.uploadContent();
        if ($(window).scrollTop() == self.element.offset().top) {
          self.revealProject();
        } else {
          $("body,html")
            .animate({ scrollTop: self.element.offset().top }, 400)
            .promise()
            .then(function() {
              self.revealProject();
            });
        }
      }
    });
    this.projectClose.on("click", function(event) {
      event.preventDefault();
      if (!self.animating) {
        self.animating = true;
        self.projectTitle.attr("style", "opacity: 0;");
        self.element.removeClass("content-visible");
        self.projectContent.one(transitionEnd, function() {
          self.projectContent.off(transitionEnd);
          self.projectContent.scrollTop(0);
          self.element.removeClass("center-title");
        });
        self.element.addClass("scaling-down");
        void self.projectMask.get(0).offsetWidth;
        self.projectMask.css("transform", "translateX(-50%) translateY(-50%)");
        self.bgImage.one(transitionEnd, function() {
          self.bgImage.off(transitionEnd);
          self.animating = false;
          self.maskScaleValue = 1;
          self.element
            .removeClass("project-selected scaling-down")
            .parent(".cd-image-mask-effect")
            .removeClass("project-view");
          $("body,html").scrollTop(self.element.offset().top);
          self.projectTitle.attr("style", "");
          window.history.pushState({ path: "index.html" }, "", "index.html");
        });
      }
    });
    this.scrollDown.on("click", function(event) {
      event.preventDefault();
      self.projectContent.animate({ scrollTop: $(window).height() }, 300);
    });
    this.projectContent.on("scroll", function() {
      if (!self.scrolling) {
        self.scrolling = true;
        !window.requestAnimationFrame
          ? setTimeout(function() {
              self.checkScrolling();
            })
          : window.requestAnimationFrame(function() {
              self.checkScrolling();
            });
      }
    });
  };
  RevealingProject.prototype.revealProject = function() {
    var self = this;
    self.updateMaskScale();
    self.projectTitle.attr("style", "opacity: 0;");
    self.projectMask
      .css(
        "transform",
        "translateX(-50%) translateY(-50%) scale(" + self.maskScaleValue + ")"
      )
      .one(transitionEnd, function() {
        self.projectMask.off(transitionEnd);
        self.animating = false;
        self.element.addClass("center-title");
        self.projectTitle.attr("style", "");
      });
    self.element
      .addClass("project-selected content-visible")
      .parent(".cd-image-mask-effect")
      .addClass("project-view");
  };
  RevealingProject.prototype.updateMask = function() {
    var self = this;
    if (this.element.hasClass("project-selected")) {
      this.updateMaskScale();
      this.element.addClass("no-transition");
      void self.projectMask.get(0).offsetWidth;
      self.projectMask.css(
        "transform",
        "translateX(-50%) translateY(-50%) scale(" + self.maskScaleValue + ")"
      );
      void self.projectMask.get(0).offsetWidth;
      self.element.removeClass("no-transition");
    }
  };
  RevealingProject.prototype.updateMaskScale = function() {
    this.maskScaleValue =
      (Math.sqrt(
        Math.pow($(window).height(), 2) + Math.pow($(window).width(), 2)
      ) *
        5 *
        this.maskScaleValue) /
      this.projectMask.width();
  };
  RevealingProject.prototype.uploadContent = function() {
    var self = this;
    if (self.projectContent.find(".content-wrapper").length == 0)
      self.projectContent.load(
        self.projectContentUrl + ".html .cd-project-info > *"
      );
    if (self.projectContentUrl + ".html" != window.location) {
      window.history.pushState(
        { path: self.projectContentUrl + ".html" },
        "",
        self.projectContentUrl + ".html"
      );
    }
  };
  RevealingProject.prototype.checkScrolling = function() {
    this.projectContent.scrollTop() > 0
      ? this.element.addClass("scrolling")
      : this.element.removeClass("scrolling");
    this.scrolling = false;
  };
  var revealingProjects = $(".cd-project-mask");
  var objRevealingProjects = [],
    windowResize = false;
  var transitionEnd =
    "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
  if (revealingProjects.length > 0) {
    revealingProjects.each(function() {
      objRevealingProjects.push(new RevealingProject($(this)));
    });
  }
  $(window).on("resize", function() {
    if (!windowResize) {
      windowResize = true;
      !window.requestAnimationFrame
        ? setTimeout(checkResize)
        : window.requestAnimationFrame(checkResize);
    }
  });
  function checkResize() {
    objRevealingProjects.forEach(function(element) {
      element.updateMask();
    });
    windowResize = false;
  }
});
