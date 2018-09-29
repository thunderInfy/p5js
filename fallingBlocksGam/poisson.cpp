#include <emscripten/bind.h>
#include <iomanip>
#include <string>
#include <map>
#include <random>

using namespace emscripten;
std::random_device rd;
std::mt19937 gen(rd());

int poissonDis(double l){
	std::poisson_distribution<> d(l);
	return d(gen);
}

int main()
{    
	return 0;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("poissonDis", &poissonDis);
}