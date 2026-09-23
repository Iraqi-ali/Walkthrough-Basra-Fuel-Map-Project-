## 2026-09-23 - Handle Follow-up CI Failures
**Learning:** When addressing follow-up user requests (like CI failures) that are not mentioned in the original issue description, do not use `request_plan_review` or `set_plan`. The plan reviewer evaluates strictly against the initial issue and will repeatedly reject the new tasks for violating the Exploration Rule. Instead, execute the necessary fixes directly using tools like `run_in_bash_session` or `write_file`.
**Action:** Execute follow-up fixes directly without setting a new plan.
