// Prove that a private birth year makes the holder at least `min_age` in `current_year`,
// without revealing the birth year. Public inputs: current_year, min_age.
fn main(birth_year: u32, current_year: pub u32, min_age: pub u32) {
    assert(birth_year <= current_year);
    assert(current_year - birth_year >= min_age);
}

#[test]
fn test_adult_passes() {
    main(1990, 2026, 18);
}

#[test(should_fail)]
fn test_minor_fails() {
    main(2015, 2026, 18);
}

#[test(should_fail)]
fn test_future_birth_fails() {
    main(2030, 2026, 18);
}
