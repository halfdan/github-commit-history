(function($) {
	$.fn.GithubCommitHistory = function(options) {
		var defaults = {
			username: "halfdan",
			repo: "github-commit-history",
			branch: "master",
			limit: 50,
			offset: 0,
			gravatar_size: 50
		};

		var options = $.extend(defaults, options);

		return this.each(function() {

			var obj = $(this);

			var template;
			$.get('_commit.html', function(data) {
				template = data;
			});

			jQuery.getJSON("http://github.com/api/v2/json/commits/list/" + options["username"] + "/" + options["repo"] + "/" + options["branch"] + "?callback=?", function(data) {

				$.each(data.commits, function(idx, commit) {
					
					// Don't show the first "offset" entries.
					if(idx < options["offset"]) {
						return true;
					}
					
					// Break out of .each of we've reached our limit.
					if(idx == options["limit"] + options["offset"]) {
						return false;
					}

					commit = $.extend(commit, options);

					// Generate gravatar ID
					commit.author.gravatar_id = $.md5(commit.author.email.toLowerCase());

					var html = Mustache.to_html(template, commit);
					obj.append(html);
				});
			});

		});
	};

})(jQuery);
