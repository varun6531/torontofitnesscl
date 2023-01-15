from django import forms


class AddClassForm(forms.Form):
    name = forms.CharField()
    description = forms.CharField()
    coach = forms.CharField()
    keyword = forms.CharField()  # bro its keyword don't be long
    capacity = forms.IntegerField()
    times = forms.DateTimeField()
    start_date = forms.DateTimeField()
    end_date = forms.DateTimeField()